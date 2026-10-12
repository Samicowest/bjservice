# BJ Services — Cybercafe Task Pipeline & FUTO Digital Hub

> **Accredited Campus Administrative, Portal Clearance & Biometrics Center**  
> Federal University of Technology, Owerri (FUTO) • Beside PPRC Building, Old Registry Area

---

## 📖 Operational Documentation

Complete role specifications, responsibility boundaries, and Role-Based Access Control (RBAC) matrices have been compiled in:

👉 **[ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md)**

### System Operational Roles
1. **👨‍🎓 Student / Customer (`customer`)** — Self-service catalog, 5 official FUTO paper document filing, Remita e-receipts, WiFi hotspot access.
2. **👩‍💻 Staff / Cybercafe Operator (`worker`)** — Walk-in desk intake, Remita RRR generation, deliverable attachments, "Needs Info" triage.
3. **🛡️ Operations Manager & Verifier (`admin`)** — Payment reconciliation, operator task assignments, turnaround SLA timer enforcement.
4. **👑 Managing Director & Proprietor (`super_admin`)** — Real-time weekly & monthly gross revenue analytics, category sales metrics, auditable system trail.

---

## 🚀 Getting Started

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🛠️ Technology Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS with custom glassmorphic design system tokens
- **State Management:** React Context API (`CyberContext.tsx`) with localStorage persistence
- **Icons:** Lucide React
- **Authentication:** Simulated multi-role session switcher with demo accounts and manual login modal

