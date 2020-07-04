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
  - feross/simple-peer uses Google's public STUN server by default, but has no TURN
  - still need signalling server https://stackoverflow.com/questions/23715773/is-stun-server-absolutely-necessary-for-webrtc-when-i-have-a-socket-io-based-sig
    - ~~serverless server w/ MongoDB to establish pairing p2p connections?~~
    - serverless ephemeral in-memory storage...
      - v1: just locally host signal server...
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

### Further reading:

- Test if behind symmetric nat - https://webrtchacks.com/symmetric-nat/

- Further reading on STUN vs TURN: https://www.twilio.com/docs/stun-turn/faq

- comparison of instant messaging protocols - https://en.wikipedia.org/wiki/Comparison_of_instant_messaging_protocols

### Other p2p chat tech

--> if it's a tech, must be actively maintained...

https://github.com/cabal-club/

https://matrix.org/

master list: https://github.com/redecentralize/alternative-internet

free signal server - https://github.com/mafintosh/signalhub (peerjs cloud is also free, but abandoned?)

https://github.com/mafintosh/webcat

https://github.com/libp2p/js-libp2p-webrtc-star

### Other p2p chat implementations

https://delta.chat/en/ - on email network (IMAP/SMTP transfer protocol)

- seems to be a bit of lag b/c email not instant?
- can't see when someone's typing...
- cool idea, but it really is just email, https://news.ycombinator.com/item?id=19216827

https://about.riot.im/ has markdown, is on Matrix

- lots of ppl using Matrix https://techcrunch.com/2020/05/21/automattic-pumps-4-6m-into-new-vector-to-help-grow-matrix-an-open-decentralized-comms-ecosystem/
