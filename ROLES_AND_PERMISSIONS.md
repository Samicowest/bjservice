# BJ Services — Role-Based Access Control (RBAC) & Operational Architecture

> **Document Version:** 2.0.0  
> **Classification:** Operational Standard Operating Procedure (SOP)  
> **Facility:** BJ Services (Unlimited Grace & Mercy) Cybercafe & Digital Hub  
> **Location:** Old Registry Area, Beside PPRC Building, Federal University of Technology, Owerri (FUTO)

---

## 1. Executive Summary

BJ Services operates a multi-tier, real-time cybercafe task pipeline designed to eliminate congestion, eliminate lost paperwork, and streamline official academic processing for students and faculty across FUTO. 

To ensure accountability, data integrity, and strict separation of operational duties from executive accounting, the system implements a **Four-Tier Role-Based Access Control (RBAC)** architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHIEF B.J. ANYANWU                              │
│                   Managing Director & Proprietor                       │
│                         [Role: super_admin]                            │
│                 Executive Suite & Revenue Analytics                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Oversees
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ENGR. BJ (SUPERVISOR)                           │
│                     Operations Manager & Verifier                      │
│                            [Role: admin]                               │
│                Manager Hub, Financial Clearance & SLAs                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Dispatches
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         BLESSING NWACHUKWU                             │
│                      Senior Cybercafe Operator                         │
│                           [Role: worker]                               │
│              Staff Desk 1, Walk-In Intake & Document Upload            │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ Serves
                                    │
┌────────────────────────────────────────────────────────────────────────┐
│                        CHIBUIKE VICTOR EZE                             │
│                     300L Undergraduate Student                         │
│                          [Role: customer]                              │
│                 Student Portal, Catalog & Form Filing                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Role Specifications

### 2.1. Student / Customer (`customer`)

* **Default Persona:** Chibuike Victor Eze
* **Designation:** 300L Undergraduate Student (Dept. of Electrical & Electronic Engineering)
* **Matriculation No:** `2021/109482`
* **Assigned View:** `CustomerView.tsx` (Student Self-Service Portal)

#### Core Responsibilities & Workflow
1. **Catalog Order Placement:** Browses available university and cybercafe services (Remita clearance, school fees, transcript dispatch, NYSC registration, O'Level uploads, plastic ID printing).
2. **Official Document Filing:** Direct digital submission of physical FUTO administrative slips:
   - `DOC-TRP-01`: Transcript Processing Form (destination address, TPS code, graduation date).
   - `DOC-SCH-02`: School Fees Remita Form (matric no, faculty, level, portal clearance).
   - `DOC-SUP-03`: Supplementary Admissions Form (10-digit JAMB reg number, chosen course).
   - `DOC-BIO-04`: Student Bio-Data Form (NIN, blood group, genotype, next of kin, sponsor).
   - `DOC-UTM-05`: Post-UTME Screening Form (O'Level sittings, scratch cards, exam center).
3. **Transparent In-Form Fee Disclosure:** Official fees and processing tariffs are calculated and verified inside the application forms prior to submission.
4. **Live Order Tracking:** Monitors real-time pipeline status using tracking codes (`TRK-XXXX-XXXX`) without visiting physical counters.
5. **Information Resolution:** Directly uploads missing credentials or replies when an operator marks an order as "Needs Info".
6. **Deliverable Retrieval:** Downloads stamped receipts, verified portal slips, and high-resolution confirmation PDFs upon task completion.
7. **Campus WiFi Hotspot Access:** Purchases and activates high-speed campus Mikrotik fibre WiFi vouchers (1-Hour, 4-Hour, 24-Hour).

---

### 2.2. Staff / Cybercafe Operator (`worker`)

* **Default Persona:** Blessing Nwachukwu
* **Designation:** Senior Cybercafe Operator
* **Station Desk:** Desk 1 (Remita Payments & Admissions Processing)
* **Phone:** `08166221330`
* **Assigned View:** `WorkerDeskView.tsx` (Operator Fulfillment Workspace)

#### Core Responsibilities & Workflow
1. **Walk-In Intake:** Processes students visiting the physical counter desk via the `WalkInModal` (creating instant tasks with cash/POS collection flags).
2. **Job Queue Execution:** Claims and processes orders assigned to their desk (generating Remita RRRs on the banking gateway, uploading credentials to JAMB CAPS, processing FUTO Form 18 & 19).
3. **Pipeline State Progression:** Advances jobs across the defined stages (`pending_payment` ➔ `verified` ➔ `assigned` ➔ `in_progress` ➔ `completed`).
4. **Needs Info Management:** Flags orders that have incorrect passwords, blurred O'Level scratch cards, or missing documents, notifying the student automatically.
5. **Deliverable Upload:** Attaches processed confirmation PDFs, stamped Remita invoices, and clearance receipts directly to the task docket.
6. **Hardware Handover:** Coordinates physical laminations, plastic ID printing (Fargo HDP5000), and hardcover thesis binding for customer counter pick-up.

---

### 2.3. Operations Manager & Verifier (`admin`)

* **Default Persona:** Engr. BJ (Supervisor)
* **Designation:** Operations Manager & Senior Systems Verifier
* **Station Desk:** Central Administration & Verification Office
* **Phone:** `08033892455`
* **Assigned View:** `AdminDashboardView.tsx` (Manager Hub & Dispatch Console)

#### Core Responsibilities & Workflow
1. **Financial Reconciliation:** Verifies bank transfers against the Moniepoint business account credit alerts and confirms Remita payment transactions before operators begin work.
2. **Task Dispatch & Load Balancing:** Assigns incoming verified tasks to available cybercafe desks based on operator specialization and queue length.
3. **Turnaround SLA Monitoring:** Monitors real-time turnaround countdown timers; prioritizes Express Queue tasks (+₦500 surcharge) and resolves bottlenecks.
4. **Quality Assurance:** Inspects completed deliverables before final release to ensure compliance with FUTO registry requirements.
5. **Exception Handling:** Manages customer escalations, re-assigns stalled tasks, and processes payment adjustments.

---

### 2.4. Managing Director & Proprietor (`super_admin`)

* **Default Persona:** Chief B.J. Anyanwu
* **Designation:** Managing Director & Proprietor
* **Station Desk:** Executive Suite
* **Phone:** `08033892455`
* **Assigned View:** `SuperAdminView.tsx` (Executive Intelligence Suite)

#### Core Responsibilities & Workflow
1. **Revenue Analytics:**
   - Real-time gross revenue tracking for the current calendar week.
   - Real-time gross revenue tracking for the current calendar month.
   - Comprehensive revenue distribution across service categories (Fees & Payments, Admissions, Printing & IDs, Remita, Campus WiFi).
2. **Staff Productivity Metrics:** Audits daily and weekly throughput per operator (total tasks processed, average SLA compliance, deliverable accuracy).
3. **System Audit Trail:** Inspects immutable event logs, timestamped payment approvals, operator claims, and customer notifications.
4. **Business Configuration:** Oversees official pricing, express surcharges, hardware allocation, and system maintenance parameters.

---

## 3. Role-Based Access Control (RBAC) Matrix

| System Feature / Capability | Student (`customer`) | Operator (`worker`) | Manager (`admin`) | Director (`super_admin`) |
| :--- | :---: | :---: | :---: | :---: |
| Browse Public Services Directory | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Submit Online Orders & Forms | ✅ Yes | ✅ Yes (Walk-in) | ✅ Yes | ✅ Yes |
| View Personal Order History | ✅ Yes | ❌ Own Only | ✅ All | ✅ All |
| Counter Walk-In Customer Intake | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| Claim & Execute Processing Tasks | ❌ No | ✅ Yes | ✅ Yes | ❌ View Only |
| Upload Completed Deliverable PDFs | ❌ No | ✅ Yes | ✅ Yes | ❌ View Only |
| Flag Task as "Needs Info" | ❌ No | ✅ Yes | ✅ Yes | ❌ View Only |
| Verify Bank Transfers & Remita RRRs | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Assign Tasks to Operator Desks | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Monitor Operator SLA Timers | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| View Operational Pipeline Stepper | ✅ (Own Task) | ✅ Yes | ✅ Yes | ✅ Yes |
| View Weekly Gross Revenue | ❌ No | ❌ No | ❌ No | ✅ Yes |
| View Monthly Gross Revenue | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Category Sales Analytics | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Operator Productivity Metrics | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Full Audit & Security Event Trail | ❌ No | ❌ No | ❌ No | ✅ Yes |

---

## 4. Operational Pipeline State Machine

Every task transitions through an auditable six-state lifecycle:

```
[Customer / Walk-In Order]
             │
             ▼
      pending_payment ───────► (Cash / Transfer verified by Manager)
             │
             ▼
          verified ──────────► (Assigned to Operator Desk by Manager)
             │
             ▼
          assigned ──────────► (Claimed by Cybercafe Operator)
             │
             ▼
        in_progress ─────────► [Needs Info] (Student uploads missing docs)
             │                        ▲
             │                        │
             ├────────────────────────┘
             ▼
        completed ───────────► (Deliverables attached & customer notified)
             │
             ▼
         collected ──────────► (Physical card or printed receipt picked up)
```

---

## 5. Testing & Authentication Guide

Role switching in the development and preview environment is handled securely through two unified interfaces:

1. **Persistent Top Bar Switcher (`DemoToolbar.tsx`):**
   - Located at the top of the application viewport.
   - Provides single-click role emulation with distinct color-coded badges for Customer, Worker, Manager, and Director.
2. **Dedicated Authentication Modal (`LoginModal.tsx`):**
   - Accessible via the **"Staff Portal" / "Sign In"** button on the main navigation bar.
   - Supports 1-click role selection or manual email credential verification.
3. **Public Landing Experience (`PublicLandingView.tsx`):**
   - Configured purely for public-facing customer engagement, service browsing, deadline alerts, and document filing without displaying sandbox or evaluator controls.

---
*BJ Services (Unlimited Grace & Mercy) — Documentation maintained by Engineering & Systems Operations.*
