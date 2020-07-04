# markdown chat app

### DB structure

```json
{
  // user email
  "email": <email>,
  "sdp": <sdp>,
  "allowedEmails": [<list of emails allowed to view my sdp>]
}
```

How to connect (essentially just need to swap SDPs):

1. User A initiates connection to User B
   - A updates their sdp.
   - B's email gets added to A's "allowedEmails" field.
2. User B sees the invite, and accepts.
   - B updates their sdp.
   - Since B is able to see A's SDP, B is successful.
   - In return, B allows A to view its SDP, by putting A in B's allowedEmails field.

### MVP

- webrtc
  - ~~serverless STUN/TURN server w/ MongoDB to establish pairing p2p connections?~~
  - firebase for SSO connection to users for chat (can look up user by email to send invite...)
    - could also use MongoDB realm...
    - sends email invite
    - or in-app live-update UI of pending invites (only if user is logged on)
- markdown support, with syntax highlighting of code snippets...

### Nice to haves

- support multiple users chatting at once...
- auto-indent/format code?
- full text search
- persist w/ IndexedDB using https://github.com/localForage/localForage
