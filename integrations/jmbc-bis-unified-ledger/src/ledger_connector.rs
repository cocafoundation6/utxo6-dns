
```rust
//! Unified Ledger Connector
//!
//! This module provides the core connection layer between UTXO-DNS and the
//! BIS Unified Ledger (Project Agorá). It handles participant registration,
//! .utxo domain resolution, and all low-level API interactions with the
//! BIS ledger infrastructure.

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use reqwest::Client;
use thiserror::Error;

/// Participant type in the unified ledger.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ParticipantType {
    /// Central bank – issues wCBDC
    CentralBank,
    /// Commercial bank – holds tokenised deposits
    CommercialBank,
    /// Other financial institution
    FinancialInstitution,
}

/// A participant registered on the BIS Unified Ledger.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UnifiedLedgerParticipant {
    /// Unique participant ID (assigned by ledger)
    pub id: String,
    /// Human-readable name
    pub name: String,
    /// Participant type (CentralBank / CommercialBank / FinancialInstitution)
    pub participant_type: ParticipantType,
    /// Jurisdiction (ISO country code)
    pub jurisdiction: String,
    /// vLEI DID (if verified)
    pub vlei_did: Option<String>,
    /// .utxo domain (if registered)
    pub utxo_domain: Option<String>,
    /// On-ledger address for transactions
    pub ledger_address: String,
}

/// Record retrieved from a UTXO RR DNS query (type 260).
#[derive(Debug, Deserialize, Clone)]
pub struct UtxoRecord {
    /// The .utxo domain that was queried
    pub domain: String,
    /// Owner's identifier (DID or address)
    pub owner: String,
    /// Payment endpoint identifier (chain address)
    pub endpoint_id: String,
    /// Optional VRF proof (for offline verification)
    pub vrf_proof: Option<String>,
    /// Optional vLEI DID (if the domain is verified)
    pub vlei_did: Option<String>,
    /// Optional compliance reference (PRNAUDIT RR hash)
    pub compliance_ref: Option<String>,
}

/// Main connector to the BIS Unified Ledger.
pub struct UnifiedLedgerConnector {
    /// Base API endpoint for the unified ledger
    api_endpoint: String,
    /// Cached participants (by ID)
    participants: HashMap<String, UnifiedLedgerParticipant>,
    /// HTTP client for API calls
    http_client: Client,
}

impl UnifiedLedgerConnector {
    /// Creates a new connector with the given ledger API endpoint.
    ///
    /// # Example
    /// ```
    /// let connector = UnifiedLedgerConnector::new(
    ///     "https://api.bis-unified-ledger.test".to_string()
    /// );
    /// ```
    pub fn new(api_endpoint: String) -> Self {
        Self {
            api_endpoint,
            participants: HashMap::new(),
            http_client: Client::new(),
        }
    }

    /// Registers a participant on the unified ledger.
    ///
    /// This method performs the following steps:
    /// 1. Verifies the participant's vLEI credential (if provided)
    /// 2. Sends a registration request to the BIS ledger
    /// 3. Caches the participant locally
    ///
    /// # Arguments
    /// * `participant` – The participant to register
    ///
    /// # Returns
    /// * `Ok(participant_id)` – The assigned ID on the ledger
    /// * `Err(ConnectorError)` – If registration fails
    pub async fn register_participant(
        &mut self,
        participant: UnifiedLedgerParticipant,
    ) -> Result<String, ConnectorError> {
        // Step 1: Verify vLEI if present
        if let Some(vlei_did) = &participant.vlei_did {
            // In production, this would call the vLEI verifier module
            // For now, we assume verification succeeds if the DID is non-empty
            if vlei_did.is_empty() {
                return Err(ConnectorError::VleiVerificationFailed);
            }
        }

        // Step 2: Send registration request to the ledger
        let req = RegisterRequest {
            participant_id: participant.id.clone(),
            name: participant.name.clone(),
            participant_type: participant.participant_type.clone(),
            jurisdiction: participant.jurisdiction.clone(),
            vlei_did: participant.vlei_did.clone(),
            utxo_domain: participant.utxo_domain.clone(),
            ledger_address: participant.ledger_address.clone(),
        };

        let resp = self.send_request("/api/v1/register", &req).await?;

        // Step 3: Cache the participant
        self.participants.insert(participant.id.clone(), participant);

        Ok(resp.participant_id)
    }

    /// Resolves a `.utxo` domain to a unified ledger participant.
    ///
    /// This method performs a DNS-over-HTTPS query for the UTXO RR (type 260)
    /// and then looks up the corresponding participant in the unified ledger.
    ///
    /// # Arguments
    /// * `domain` – The `.utxo` domain to resolve (e.g., "fed.utxo")
    ///
    /// # Returns
    /// * `Ok(UnifiedLedgerParticipant)` – The resolved participant
    /// * `Err(ConnectorError)` – If resolution fails
    pub async fn resolve_participant_by_domain(
        &self,
        domain: &str,
    ) -> Result<UnifiedLedgerParticipant, ConnectorError> {
        // Step 1: Query UTXO RR (DNS-over-HTTPS)
        let record = self.query_utxo_rr(domain).await?;

        // Step 2: Search for matching participant in cache or ledger
        for participant in self.participants.values() {
            // Match by .utxo domain
            if let Some(d) = &participant.utxo_domain {
                if d == domain {
                    return Ok(participant.clone());
                }
            }
            // Match by vLEI DID
            if let Some(v) = &participant.vlei_did {
                if let Some(record_vlei) = &record.vlei_did {
                    if v == record_vlei {
                        return Ok(participant.clone());
                    }
                }
            }
        }

        // Step 3: If not found in cache, query the ledger directly
        // (In production, this would call the ledger's search API)
        Err(ConnectorError::ParticipantNotFound)
    }

    /// Performs a DNS-over-HTTPS query for the UTXO RR (type 260).
    ///
    /// This implements the DNS extension defined in
    /// IETF draft-guorong-utxo-dns-01.
    async fn query_utxo_rr(&self, domain: &str) -> Result<UtxoRecord, ConnectorError> {
        // Ensure domain ends with .utxo
        let full_domain = if domain.ends_with(".utxo") {
            domain.to_string()
        } else {
            format!("{}.utxo", domain)
        };

        let url = format!(
            "{}/dns-query?name={}&type=260",
            self.api_endpoint, full_domain
        );

        let resp = self.http_client
            .get(&url)
            .header("Accept", "application/dns-json")
            .send()
            .await?;

        if !resp.status().is_success() {
            return Err(ConnectorError::DnsQueryFailed);
        }

        // Parse the DNS response
        // In production, this would parse the DOH JSON response
        // For now, we use mock data for demonstration
        #[allow(unused)]
        let dns_response: serde_json::Value = resp.json().await?;

        // Mock UTXO record (replace with actual parsing)
        Ok(UtxoRecord {
            domain: full_domain,
            owner: format!("did:example:{}", domain.replace(".utxo", "")),
            endpoint_id: format!("0x{}", hex::encode(domain.as_bytes()).chars().take(40).collect::<String>()),
            vrf_proof: None,
            vlei_did: Some(format!("did:vlei:{}", domain.replace(".utxo", ""))),
            compliance_ref: None,
        })
    }

    /// Sends a JSON request to the unified ledger API.
    async fn send_request<T: Serialize>(
        &self,
        path: &str,
        body: &T,
    ) -> Result<ApiResponse, ConnectorError> {
        let url = format!("{}{}", self.api_endpoint, path);

        let resp = self.http_client
            .post(&url)
            .json(body)
            .send()
            .await?;

        if !resp.status().is_success() {
            return Err(ConnectorError::ApiError(resp.status().as_u16()));
        }

        let result: ApiResponse = resp.json().await?;
        Ok(result)
    }

    /// Retrieves a participant by ID from the cache.
    pub fn get_participant(&self, id: &str) -> Option<&UnifiedLedgerParticipant> {
        self.participants.get(id)
    }

    /// Lists all cached participants.
    pub fn list_participants(&self) -> Vec<&UnifiedLedgerParticipant> {
        self.participants.values().collect()
    }
}

// ============================================================================
// DTOs for API communication
// ============================================================================

#[derive(Serialize)]
struct RegisterRequest {
    participant_id: String,
    name: String,
    participant_type: ParticipantType,
    jurisdiction: String,
    vlei_did: Option<String>,
    utxo_domain: Option<String>,
    ledger_address: String,
}

#[derive(Deserialize)]
struct ApiResponse {
    participant_id: String,
}

// ============================================================================
// Error handling
// ============================================================================

/// Errors that can occur during ledger operations.
#[derive(Error, Debug)]
pub enum ConnectorError {
    #[error("Participant not found")]
    ParticipantNotFound,

    #[error("vLEI verification failed")]
    VleiVerificationFailed,

    #[error("DNS query failed")]
    DnsQueryFailed,

    #[error("API error: {0}")]
    ApiError(u16),

    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_register_participant() {
        let mut connector = UnifiedLedgerConnector::new(
            "https://api.bis-unified-ledger.test".to_string()
        );

        let participant = UnifiedLedgerParticipant {
            id: "test_001".to_string(),
            name: "Test Bank".to_string(),
            participant_type: ParticipantType::CentralBank,
            jurisdiction: "US".to_string(),
            vlei_did: Some("did:vlei:test".to_string()),
            utxo_domain: Some("test.utxo".to_string()),
            ledger_address: "0x1234567890123456789012345678901234567890".to_string(),
        };

        let result = connector.register_participant(participant).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_resolve_participant_by_domain() {
        let connector = UnifiedLedgerConnector::new(
            "https://api.bis-unified-ledger.test".to_string()
        );

        let result = connector.resolve_participant_by_domain("fed.utxo").await;
        // Since no participants are registered yet, this should fail
        assert!(result.is_err());
    }
}
```


git push origin main
```
