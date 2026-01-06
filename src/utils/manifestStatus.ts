export interface AccountAssociation {
  header: string
  payload: string
  signature: string
}

export interface ManifestStatus {
  isSigned: boolean
  accountAssociation?: AccountAssociation
  error?: string
}

/**
 * Fetches and validates the Farcaster manifest
 */
export async function getManifestStatus(): Promise<ManifestStatus> {
  try {
    const response = await fetch('/.well-known/farcaster.json')
    
    if (!response.ok) {
      return {
        isSigned: false,
        error: `Failed to fetch manifest: ${response.status} ${response.statusText}`
      }
    }

    const manifest = await response.json()
    
    // Check if accountAssociation exists and has required fields
    const accountAssociation = manifest.accountAssociation
    
    if (!accountAssociation) {
      return {
        isSigned: false,
        error: 'No accountAssociation found in manifest'
      }
    }

    const hasRequiredFields = 
      accountAssociation.header &&
      accountAssociation.payload &&
      accountAssociation.signature

    if (!hasRequiredFields) {
      return {
        isSigned: false,
        accountAssociation,
        error: 'accountAssociation is missing required fields (header, payload, or signature)'
      }
    }

    return {
      isSigned: true,
      accountAssociation
    }
  } catch (error) {
    return {
      isSigned: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Simple check if manifest is signed (has all required fields)
 */
export async function isManifestSigned(): Promise<boolean> {
  const status = await getManifestStatus()
  return status.isSigned
}
