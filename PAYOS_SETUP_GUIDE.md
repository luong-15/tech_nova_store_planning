# PayOS Integration Setup Guide

## Overview

This guide covers the complete setup of PayOS payment integration using the official PayOS SDK (`@payos/node` v2.0.5).

### What's Included

- ✅ PayOS SDK Integration (@payos/node)
- ✅ Payment Link Generation with QR Codes
- ✅ Webhook Signature Verification using PayOS SDK
- ✅ Order Payment Status Updates
- ✅ Full error handling and logging

## Prerequisites

1. **PayOS Account** - Create at https://payos.vn/
2. **PayOS API Credentials** - Available in PayOS Dashboard
   - Client ID
   - API Key
   - Checksum Key (for webhook signature verification)
3. **Deployed Application** - Your app must be publicly accessible (not localhost)

## Step 1: Get Your PayOS Credentials

1. Log in to [PayOS Dashboard](https://dashboard.payos.vn/)
2. Navigate to **Settings** → **API Integration**
3. Copy the following:
   - **Client ID** → `PAYOS_CLIENT_ID`
   - **API Key** → `PAYOS_API_KEY`
   - **Checksum Key** → `PAYOS_CHECKSUM_KEY`

**Important:** The Checksum Key is sensitive - treat it like a password. Keep it in your environment variables only.

## Step 2: Set Environment Variables in v0

1. Go to **Settings** (top right) → **Vars**
2. Add the following environment variables:

```
PAYOS_CLIENT_ID=your_client_id_here
PAYOS_API_KEY=your_api_key_here
PAYOS_CHECKSUM_KEY=your_checksum_key_here
```

**Verify:**
- No spaces before or after values
- All three variables are set
- Values match exactly what's in PayOS Dashboard

## Step 3: Register Your Webhook URL

The webhook URL must be publicly accessible. If using v0 deployment:

**Webhook URL:**
```
https://your-deployed-domain.com/api/payos/webhook
```

### Register in PayOS Dashboard

1. Log in to PayOS Dashboard
2. Navigate to **Settings** → **Webhook Configuration** (or Integrations)
3. Paste the webhook URL:
   ```
   https://your-deployed-domain.com/api/payos/webhook
   ```
4. Click **Test/Validate** (if available)
   - Should respond: `200 OK` with body `"OK"`
5. Click **Register** or **Save**
6. Wait for confirmation - webhook should show **Active** ✓

### Troubleshooting Webhook Registration

| Problem | Solution |
|---------|----------|
| **401 Unauthorized** | Checksum Key mismatch. Verify in v0 Vars matches PayOS exactly. |
| **Connection timeout** | Domain not publicly accessible. Deploy and verify DNS. |
| **Endpoint not found** | Wrong URL path. Should be exactly `/api/payos/webhook` |
| **Webhook validation fails** | GET request to endpoint failed. Test: `curl https://your-domain/api/payos/webhook` |

## Step 4: How Payment Flow Works

### User initiates payment (Frontend)

```javascript
// User clicks "Pay with PayOS"
POST /api/payos/payment
Body: {
  order_id: "order-123",
  return_url: "https://your-domain.com/payment-success"
}
```

### Backend creates payment link

```
GET /api/payos/payment (response)
{
  success: true,
  qr_code: "base64_or_url",
  amount: 50000,
  instructions: "Scan QR code to pay"
}
```

### User scans QR or clicks link

- User scans QR code in PayOS app
- Or opens payment link
- Completes payment in PayOS interface

### PayOS sends webhook notification

```
POST /api/payos/webhook (from PayOS servers)
{
  code: "00",
  desc: "success",
  data: {
    orderCode: "order-123",
    amount: 50000,
    amountPaid: 50000,
    status: 1,  // 1 = paid
    ...
  },
  signature: "hmac_sha256_hash"
}
```

### Backend verifies and updates order

1. Verify signature using PayOS SDK
2. Update order `payment_status = "paid"`
3. Return success to PayOS
4. User sees payment confirmation

## Step 5: Database Schema

### Orders Table Structure

Your orders table should have these payment-related columns:

```sql
- payment_method: TEXT (e.g., "payos")
- payment_status: TEXT (e.g., "pending", "paid", "failed", "cancelled")
- total: DECIMAL (order total in VND)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Status Mappings

| PayOS Status | System Status | Meaning |
|-------------|---------------|---------|
| 0 | pending | Waiting for payment |
| 1 | paid | Successfully paid |
| -1 | cancelled | Payment cancelled by user |
| -2 | failed | Payment failed |

## Step 6: Testing the Integration

### Test Payment (if PayOS supports)

1. In PayOS Dashboard, look for "Test Payment" or similar
2. Send a test webhook payload
3. Check v0 Logs for:
   ```
   [v0] PayOS Webhook received
   [v0] PayOS Webhook signature verified successfully
   ```

### Manual Testing (Advanced)

You can test webhook locally using a tool like ngrok or by manually sending a POST request with a valid PayOS signature.

## File Locations

### Key API Routes

- **Payment Initiation**: `/app/api/payos/payment/route.ts`
  - POST: Create payment link
  - GET: Check if PayOS is configured

- **Webhook Handler**: `/app/api/payos/webhook/route.ts`
  - POST: Receive webhook, verify signature, update order
  - GET: PayOS validation endpoint

### Configuration

- Environment variables loaded from v0 Settings → Vars
- All three PayOS credentials required: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`

## Monitoring & Debugging

### Check Logs

1. Go to v0 Settings → **Logs**
2. Look for entries starting with `[v0] PayOS`
3. Example successful log:
   ```
   [v0] PayOS Webhook received - Full payload: {...}
   [v0] PayOS Webhook signature verified successfully
   ```

### Common Issues & Solutions

#### Payment link not generated
- Check all three environment variables are set
- Verify they match PayOS Dashboard exactly
- Restart dev server to reload environment

#### Webhook 401 error during registration
- Checksum Key is incorrect
- Copy from PayOS Dashboard again, ensuring no extra spaces
- Update in v0 Vars and wait for server restart

#### Webhook not received after payment
- Verify webhook URL registered in PayOS Dashboard
- Check v0 Logs for incoming webhooks
- Confirm order ID in webhook matches database

#### Signature verification fails
- PayOS SDK handles signature verification automatically
- If failing, Checksum Key is likely wrong
- Check error logs for specific mismatch details

## Production Checklist

Before going live:

- [ ] All three PayOS credentials are set in v0 Vars
- [ ] App is deployed to a public domain (not localhost)
- [ ] Webhook URL is registered in PayOS Dashboard
- [ ] Webhook shows **Active** status ✓
- [ ] Test payment processes successfully
- [ ] Order payment_status updates in database
- [ ] Admin can see payment history
- [ ] Email confirmation sent after payment (if configured)

## Support & Resources

- **PayOS Documentation**: https://developers.payos.vn
- **PayOS Dashboard**: https://dashboard.payos.vn
- **SDK Repository**: https://github.com/payostech/payos-node

## Additional Configuration

### Custom Webhook Response (Optional)

You can customize webhook behavior in `/app/api/payos/webhook/route.ts`:
- Send email confirmations
- Update inventory
- Create shipping labels
- Send webhooks to other services

Just add your logic in the webhook handler after the signature verification.

### Custom Amount Formatting

PayOS expects amounts in VND (Vietnamese Dong) as integers:
- 50,000 VND → `50000` (no decimals)
- The SDK automatically handles this conversion

---

**Last Updated:** 2026-06-21
**SDK Version:** @payos/node v2.0.5
