import { GeneVerificationData } from "./api";

export interface PopUpTableProps {
    tableOpen: boolean;
    data?: GeneVerificationData | null;
    geneIDs: string[];
    handleGenerateGraph: () => void;
    setTableOpen: (open: boolean) => void;
}