# PayOS Webhook Setup Checklist

## Pre-Registration Checklist

Before registering the webhook in PayOS Dashboard, verify:

- [ ] **Application is deployed** to a public domain
  - Your app must be accessible from the internet
  - Not just localhost or dev server
  
- [ ] **Webhook endpoint responds correctly**
  ```bash
  curl -i https://your-deployed-domain.com/api/payos/webhook
  # Should respond: HTTP 200 OK with body "OK"
  ```

- [ ] **Environment variables are set** in v0 Settings → Vars:
  - [ ] `PAYOS_CLIENT_ID` - set and not empty
  - [ ] `PAYOS_API_KEY` - set and not empty
  - [ ] `PAYOS_CHECKSUM_KEY` - set and exactly matches PayOS Dashboard
  
- [ ] **CHECKSUM_KEY verification:**
  - Go to PayOS Dashboard
  - Copy the Checksum Key from Settings
  - Paste it into v0 Vars → PAYOS_CHECKSUM_KEY
  - **Do NOT add or remove any spaces or characters**

## Registration Steps

1. [ ] Prepare webhook URL:
   ```
   https://your-deployed-domain.com/api/payos/webhook
   ```

2. [ ] Log in to PayOS Dashboard

3. [ ] Navigate to: **Settings → Webhook Configuration** (or similar)

4. [ ] Paste the webhook URL

5. [ ] Click "Test Webhook" or "Validate" (if available)
   - This sends a GET request to verify the endpoint exists
   - Should return `200 OK`

6. [ ] Click "Register" or "Save"
   - If you get error 401, go to Troubleshooting section
   - If you get error null, check GET endpoint responds with "OK"

7. [ ] Verify in PayOS Dashboard:
   - Webhook should show a green checkmark ✓
   - Status should show "Active" or "Connected"

## After Registration

- [ ] **Test webhook delivery** (if PayOS provides test option)
  - Send a test payment notification
  - Check v0 Logs for webhook received

- [ ] **Monitor logs** during first payment:
  - Go to v0 Settings → Logs
  - Process a test payment
  - Look for webhook signature verification logs
  - Should see: `[v0] PayOS Webhook - Signature match: true`

- [ ] **Verify database updates:**
  - After payment, check database
  - Order payment_status should update automatically
  - payment_method should be "payos"

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Error 401 | CHECKSUM_KEY mismatch. Copy exactly from PayOS. |
| Error null | Webhook endpoint not responding with 200 OK. |
| Endpoint not found | Wrong domain or path. Should be `/api/payos/webhook` |
| Environment var not loading | Go to Vars, edit PAYOS_CHECKSUM_KEY to force reload |
| Signature verification fails | Log shows mismatch - CHECKSUM_KEY is incorrect |

## Support

If still having issues:
1. Check `WEBHOOK_TROUBLESHOOTING.md` for detailed debugging
2. Review v0 Logs for error messages
3. Verify all env vars are correctly set
4. Contact PayOS support with your webhook URL and error code
