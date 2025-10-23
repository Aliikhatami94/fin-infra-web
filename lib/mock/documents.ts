import { AlertCircle, FileText } from "lucide-react"
import type { Document, DocumentInsight } from "@/types/domain"

export const documents: Document[] = [
  {
    id: 1,
    name: "Chase Statement - December 2024",
    institution: "Chase",
    type: "Statement",
    date: "Dec 31, 2024",
    dateValue: new Date("2024-12-31"),
    size: "1.2 MB",
    sizeValue: 1.2,
  },
  {
    id: 2,
    name: "Fidelity Tax Form 1099",
    institution: "Fidelity",
    type: "Tax Document",
    date: "Jan 15, 2025",
    dateValue: new Date("2025-01-15"),
    size: "245 KB",
    sizeValue: 0.245,
  },
  {
    id: 3,
    name: "Annual Investment Report 2024",
    institution: "Fidelity",
    type: "Report",
    date: "Dec 31, 2024",
    dateValue: new Date("2024-12-31"),
    size: "3.8 MB",
    sizeValue: 3.8,
  },
  {
    id: 4,
    name: "Chase Statement - November 2024",
    institution: "Chase",
    type: "Statement",
    date: "Nov 30, 2024",
    dateValue: new Date("2024-11-30"),
    size: "1.1 MB",
    sizeValue: 1.1,
  },
  {
    id: 5,
    name: "Robinhood Trade Confirmation",
    institution: "Robinhood",
    type: "Confirmation",
    date: "Dec 15, 2024",
    dateValue: new Date("2024-12-15"),
    size: "156 KB",
    sizeValue: 0.156,
  },
  {
    id: 6,
    name: "BofA Credit Card Statement",
    institution: "Bank of America",
    type: "Statement",
    date: "Dec 31, 2024",
    dateValue: new Date("2024-12-31"),
    size: "890 KB",
    sizeValue: 0.89,
  },
]

export const documentInsights: DocumentInsight[] = [
  {
    icon: AlertCircle,
    text: "Missing Q4 2024 tax documents from 2 brokers. Upload by March 15 to avoid delays.",
    color: "text-[var(--color-warning)]",
    bgColor: "bg-[var(--color-warning)]/10",
    action: "Upload Now",
  },
  {
    icon: FileText,
    text: "Your 2024 tax documents are ready for review. Estimated refund: $2,340.",
    color: "text-[var(--color-positive)]",
    bgColor: "bg-[var(--color-positive)]/10",
    action: "Review",
  },
]
