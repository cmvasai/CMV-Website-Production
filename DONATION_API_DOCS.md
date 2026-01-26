# Donation API Documentation

## Frontend-Backend Integration Guide

This document describes how the frontend integrates with the backend for donation processing via Mswipe payment gateway.

## Payment Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE PAYMENT FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  FRONTEND                        BACKEND                         MSWIPE        │
│  ────────                        ───────                         ──────        │
│                                                                                 │
│  1. User fills donation form                                                    │
│           │                                                                     │
│           ▼                                                                     │
│  2. POST /api/mswipe/initiate ────────► Creates PENDING donation               │
│     (donation details)                          │                               │
│                                                 ▼                               │
│                                        Calls CreatePBLAuthToken ────► Token    │
│                                                 │                               │
│                                                 ▼                               │
│                                        Calls MswipePayment ─────────► smslink  │
│                                                 │                               │
│                                                 ▼                               │
│  3. Receives { paymentUrl, donationRef } ◄─────┘                               │
│           │                                                                     │
│           ▼                                                                     │
│  4. window.location.href = paymentUrl ──────────────────────────► Payment Page │
│                                                                         │       │
│                                                                         ▼       │
│                                                              User pays here     │
│                                                                         │       │
│                                                                         ▼       │
│                                        BackPosting webhook ◄────────────┘       │
│                                        POST /api/mswipe/callback                │
│                                                 │                               │
│                                                 ▼                               │
│                                        Updates donation to SUCCESS/FAILED       │
│                                        Sends confirmation email (if SUCCESS)    │
│                                                 │                               │
│                                                 ▼                               │
│  5. User redirected to ◄───────────── redirect_url?status=success&ref=xxx      │
│     /payment-result page                                                        │
│           │                                                                     │
│           ▼                                                                     │
│  6. GET /api/mswipe/status/:ref ─────► Returns final status                    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints

### 1. POST /api/mswipe/initiate

Initiates a new donation payment session.

**Request Body:**
```json
{
  "fullName": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "phoneNumber": "string (required, 10 digits)",
  "amount": "number (required, positive)",
  "state": "string (required, Indian state)",
  "city": "string (required)",
  "pinCode": "string (required, 6 digits)",
  "address": "string (required)",
  "seek80G": "'yes' | 'no' (required)",
  "reasonForDonation": "string (required, one of predefined values)",
  "purpose": "string (optional)",
  "panCardNumber": "string (optional, 10 chars for 80G)"
}
```

**Valid reasonForDonation values:**
- General Donation
- Gurudakshina
- Event Sponsorship
- Building Fund
- Educational Support
- Community Service
- Special Occasion
- Other

**Success Response (200):**
```json
{
  "success": true,
  "paymentUrl": "https://...",
  "donationRef": "CMV17688247321751938",
  "orderId": "CMV17688247321759427"
}
```

**Error Response (400/500):**
```json
{
  "errors": ["array of validation errors"],
  "error": "single error message"
}
```

### 2. GET /api/mswipe/status/:donationRef

Retrieves the current status of a donation.

**Success Response (200):**
```json
{
  "donationRef": "CMV17688247321751938",
  "status": "SUCCESS | PENDING | FAILED",
  "amount": 100,
  "transactionRef": "000007963164",
  "ipgId": "IPG000000031322",
  "createdAt": "2026-01-19T12:12:12.179Z",
  "updatedAt": "2026-01-19T12:15:30.862Z"
}
```

### 3. POST /api/mswipe/verify/:donationRef

Force-verifies a donation status with Mswipe API (for stuck pending payments).

**Success Response (200):**
```json
{
  "donationRef": "CMV17688247321751938",
  "status": "SUCCESS",
  "mswipeStatus": {
    "ipgId": "IPG000000031322",
    "status": "SUCCESS",
    "statusCode": 1,
    "paymentId": "000007963164"
  },
  "amount": 100,
  "transactionRef": "000007963164",
  "updatedAt": "2026-01-19T12:15:30.862Z"
}
```

## Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/donate` | `Donate.jsx` | Donation form page |
| `/payment-result` | `DonationResult.jsx` | Payment result page (new) |
| `/donation/result` | `DonationResult.jsx` | Payment result page (legacy) |

## Security Rules

### ✅ DO:
- Always redirect users to `paymentUrl` from backend response
- Always verify payment status with `/api/mswipe/status/:ref` after redirect
- Store `donationRef` in localStorage before redirecting (as fallback)
- Show loading states during API calls
- Handle all error cases gracefully
- Validate form data on frontend before submission

### ❌ DON'T:
- Never call Mswipe API directly from frontend
- Never trust URL parameters as final payment status
- Never store or expose any API credentials in frontend code
- Never modify or construct payment URLs manually
- Never assume payment succeeded based on redirect alone

## Environment Variables

```env
VITE_BACKEND_URL=http://localhost:5002  # Development
VITE_BACKEND_URL=https://api.chinmayamissionvasai.com  # Production
```

---

**Last Updated:** January 19, 2026
