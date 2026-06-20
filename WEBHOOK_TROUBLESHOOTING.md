# PayOS Webhook 401 Error Troubleshooting Guide

## Error: "Webhook url của bạn hiện đang không hoạt động, mã lỗi: 401"

This error indicates that **PayOS is rejecting your webhook URL registration**, usually due to signature verification failure.

## Root Causes & Solutions

### 1. **PAYOS_CHECKSUM_KEY Format Issue** (Most Common)
PayOS is very strict about the checksum key format. It must be **exactly** as provided by PayOS.

**Check:**
- Go to PayOS Dashboard → Settings → Webhook Configuration
- Copy the **Checksum Key** exactly as shown (no spaces before/after)
- Paste it into your environment variable: `PAYOS_CHECKSUM_KEY`
- **Important:** The key should be a string, typically 32+ characters

**Verify in v0:**
1. Go to **Settings** (top right) → **Vars**
2. Find `PAYOS_CHECKSUM_KEY` and verify it matches PayOS exactly
3. If there are extra spaces or characters, remove them

### 2. **Webhook Payload Structure Mismatch**
The order of fields in the signature calculation matters.

**Expected format (alphabetical order):**
```
amount=VALUE&amountPaid=VALUE&amountRemaining=VALUE&code=VALUE&desc=VALUE&orderCode=VALUE&status=VALUE&transactionDateTime=VALUE
```

The code now handles this automatically with alphabetically sorted fields.

### 3. **Environment Variable Not Loaded**
Sometimes the environment variable doesn't reload properly.

**Solution:**
1. In v0 Settings → Vars, update `PAYOS_CHECKSUM_KEY` with any small change (add/remove a character then undo)
2. This forces a reload
3. Wait for the dev server to restart

### 4. **Webhook URL Accessibility**
PayOS validates the webhook by sending a GET request to your URL.

**Check:**
- Your deployed domain must be publicly accessible
- The endpoint `/api/payos/webhook` must respond with `200 OK` and `Content-Type: text/plain`

**Test manually:**
```bash
curl -i https://your-domain.com/api/payos/webhook
# Should return: HTTP 200 OK with body "OK"
```

## Debug Mode

To enable detailed logging of webhook signature verification:

1. **Check Server Logs:**
   - In v0, go to **Settings** → **Logs**
   - Try registering the webhook again
   - Look for logs starting with `[v0] PayOS Webhook`

2. **Example successful log:**
   ```
   [v0] PayOS Webhook - Payload structure:
   [v0]   signature (from payload): abc123def456...
   [v0]   code: 00
   [v0]   desc: success
   [v0] PayOS Webhook - Signature match: true
   ```

3. **Example failed log:**
   ```
   [v0] PayOS Webhook - Signature match: false
   [v0] Signature mismatch!
   [v0]   Expected: abc123...
   [v0]   Got:      xyz789...
   ```

## Step-by-Step Fix

1. **Verify Checksum Key:**
   - PayOS Dashboard → Settings
   - Copy Checksum Key exactly
   - v0 Settings → Vars → PAYOS_CHECKSUM_KEY
   - Paste and save

2. **Verify Domain:**
   - Ensure your domain is deployed and public
   - Test: `curl https://your-domain.com/api/payos/webhook`

3. **Register Webhook:**
   - Go back to PayOS Dashboard
   - Click "Test Webhook URL" or "Register"
   - Should now show success (green checkmark)

4. **Monitor Logs:**
   - Go to v0 Settings → Logs
   - Each webhook registration attempt will show logs
   - Verify signature verification passes

## Still Not Working?

1. **Check if PAYOS_CHECKSUM_KEY is actually a valid secret key:**
   - It should be a long string (32+ characters)
   - Not just numbers or simple text

2. **Verify API Keys are also configured:**
   - PAYOS_CLIENT_ID
   - PAYOS_API_KEY
   - Both should be set in v0 Vars

3. **Contact PayOS Support:**
   - If the checksum key is wrong, only PayOS support can provide a new one
   - Provide them with your webhook URL: `https://your-domain.com/api/payos/webhook`

## Webhook URL Reference

**Your webhook endpoint URL:**
```
https://your-domain.com/api/payos/webhook
```

Replace `your-domain.com` with your actual deployed domain.

**Test endpoint (for debugging):**
```
https://your-domain.com/api/payos/webhook?test=1
```
Returns JSON with webhook status.
