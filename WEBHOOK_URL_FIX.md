# How to Fix PayOS Webhook URL Error

## The Error You're Seeing

```
"Điểm cuối thanh toán PayOS đang hoạt động"
"message": "...",
"configured": false
```

This error means PayOS is trying to validate your webhook URL, but it's getting a response that indicates PayOS is not properly configured on your server.

## Root Cause

When PayOS tries to register a webhook, it sends a GET request to test the endpoint. Your endpoint was returning a JSON response that included `"configured": false`, which PayOS interprets as a failed validation.

## The Fix (What I Did)

I've updated your webhook endpoint to:

1. **Return `200 OK` with plain text "OK"** when PayOS validates the webhook
2. **Use PayOS SDK's official signature verification** instead of manual HMAC calculation
3. **Set `configured: true`** when all environment variables are present

## What You Need to Do

### Step 1: Verify Environment Variables

Go to **v0 Settings** → **Vars** and confirm all three are set:

- ✅ `PAYOS_CLIENT_ID` - (should be a long alphanumeric string)
- ✅ `PAYOS_API_KEY` - (should be a long key)
- ✅ `PAYOS_CHECKSUM_KEY` - (should be 32+ characters)

**If any are missing:**
1. Copy from PayOS Dashboard → Settings → API Integration
2. Paste into v0 Vars
3. Make sure there are NO extra spaces before or after

### Step 2: Deploy Your App

Your app must be deployed to a **public domain**. The webhook URL looks like:
```
https://your-deployed-domain.com/api/payos/webhook
```

### Step 3: Try Registering the Webhook Again

In PayOS Dashboard:
1. Go to **Settings** → **Webhook Configuration**
2. Enter your webhook URL
3. Click **Test** (if available) - should respond with 200 OK
4. Click **Register** or **Save**

If you still see an error, go to **Step 4** below.

### Step 4: Debug the Issue

#### Option A: Use the Test Endpoint

Visit this URL in your browser:
```
https://your-deployed-domain.com/api/payos/webhook?test=1
```

You should see:
```json
{
  "status": "webhook active",
  "endpoint": "/api/payos/webhook",
  "checksum_configured": true,
  "timestamp": "2026-06-21T..."
}
```

If `"checksum_configured"` is `false`, your `PAYOS_CHECKSUM_KEY` is not set.

#### Option B: Check v0 Logs

1. Go to v0 **Settings** → **Logs**
2. Try registering webhook again in PayOS
3. Look for error messages or configuration issues

#### Option C: Test Endpoint Response

Use curl to test:
```bash
curl -i https://your-deployed-domain.com/api/payos/webhook
```

Should return:
```
HTTP/1.1 200 OK
Content-Type: text/plain

OK
```

## If Still Not Working

### Common Issues

| Issue | Fix |
|-------|-----|
| `configured: false` in response | Set `PAYOS_CHECKSUM_KEY` in v0 Vars |
| Domain not accessible | Deploy app first, verify domain is public |
| Wrong webhook URL | Should be exactly `https://domain.com/api/payos/webhook` |
| Env vars not updated | Restart dev server after adding vars |
| Certificate error | Your domain's SSL certificate is invalid |

### Verify Each Component

1. **Test GET endpoint:**
   ```bash
   curl https://your-domain.com/api/payos/webhook
   # Should return: 200 OK with body "OK"
   ```

2. **Check environment variables loaded:**
   ```bash
   curl https://your-domain.com/api/payos/webhook?test=1
   # Should show all configuration status
   ```

3. **Verify PayOS credentials in Dashboard:**
   - Go to https://dashboard.payos.vn
   - Settings → API Integration
   - Copy credentials exactly as shown (no extra spaces)

## What Changed in the Code

**Webhook GET Handler** (`/api/payos/webhook` route.ts):
- ✅ Now returns `200 OK` with `"OK"` text
- ✅ Returns proper configuration status when tested
- ✅ PayOS validation should now succeed

**Webhook POST Handler**:
- ✅ Uses official PayOS SDK `verifyIPN()` method
- ✅ Properly handles webhook signature verification
- ✅ Updates order payment status in database

**Payment Endpoint**:
- ✅ Now creates actual PayOS payment links
- ✅ Returns QR code for payment
- ✅ Uses PayOS SDK for all operations

## Next Steps

After webhook registration succeeds:

1. **Test a payment:**
   - Add item to cart
   - Proceed to checkout
   - Click "Pay with PayOS"
   - Scan QR code (test transaction)

2. **Verify order updates:**
   - After payment, check database
   - Order `payment_status` should change to `"paid"`
   - Order `payment_method` should be `"payos"`

3. **Monitor webhooks:**
   - Go to v0 Logs
   - Look for `[v0] PayOS Webhook received`
   - Verify signature verification passes

## Files Changed

- ✅ `/app/api/payos/webhook/route.ts` - Fixed webhook validation
- ✅ `/app/api/payos/payment/route.ts` - Implemented payment link generation
- ✅ Installed `@payos/node` SDK package

## Questions?

If webhook still fails after these steps:
1. Check all three environment variables are set correctly
2. Verify your domain is publicly accessible
3. Look at v0 Logs for specific error messages
4. Compare your Checksum Key character-by-character with PayOS Dashboard

---

**Still stuck?** The detailed setup guide is in `PAYOS_SETUP_GUIDE.md`
