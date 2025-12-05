import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { downloadSampleCSV } from "@/lib/demoData";
import {
    Upload as UploadIcon,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    Download,
    Trash2,
} from "lucide-react";

interface UploadResult {
    success: boolean;
    rows_processed: number;
    rows_inserted: number;
    rows_updated: number;
    rows_failed: number;
    errors: Array<{ row_number: number; field: string; error: string }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function Upload() {
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { success, error: showError } = useToast();
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async (file: File): Promise<UploadResult> => {
            const formData = new FormData();
            formData.append("file", file);

            // Simulate progress for demo
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            try {
                const response = await fetch(`${API_BASE_URL}/upload/csv`, {
                    method: "POST",
                    body: formData,
                });

                clearInterval(progressInterval);
                setUploadProgress(100);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
                }

                const result = await response.json();
                return result.data || result;
            } catch (err) {
                clearInterval(progressInterval);
                setUploadProgress(0);
                throw err;
            }
        },
        onSuccess: (data) => {
            if (data.success) {
                success(
                    "Upload Successful",
                    `Processed ${data.rows_processed} rows. ${data.rows_inserted} inserted, ${data.rows_updated} updated.`
                );
                // Invalidate dashboard queries to refresh data
                queryClient.invalidateQueries({ queryKey: ["dashboard"] });
                queryClient.invalidateQueries({ queryKey: ["merchants"] });
            } else {
                showError("Upload Completed with Errors", `${data.rows_failed} rows failed`);
            }
        },
        onError: (err: Error) => {
            showError("Upload Failed", err.message);
        },
    });

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.name.endsWith(".csv")) {
            setFile(droppedFile);
            setUploadProgress(0);
            uploadMutation.reset();
        } else {
            showError("Invalid File", "Please upload a CSV file");
        }
    }, [showError, uploadMutation]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile?.name.endsWith(".csv")) {
            setFile(selectedFile);
            setUploadProgress(0);
            uploadMutation.reset();
        } else if (selectedFile) {
            showError("Invalid File", "Please upload a CSV file");
        }
    };

    const handleUpload = () => {
        if (file) {
            setUploadProgress(0);
            uploadMutation.mutate(file);
        }
    };

    const handleClear = () => {
        setFile(null);
        setUploadProgress(0);
        uploadMutation.reset();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const result = uploadMutation.data;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <UploadIcon className="h-8 w-8 text-primary" />
                    Import Data
                </h1>
                <p className="text-muted-foreground">
                    Upload transaction data to populate your analytics dashboard
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Upload Zone */}
                <div className="lg:col-span-2">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>CSV Upload</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Drop Zone */}
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
                                    dragOver
                                        ? "border-primary bg-primary/5 scale-[1.01]"
                                        : "border-muted-foreground/25 hover:border-primary/50",
                                    uploadMutation.isPending && "pointer-events-none opacity-50"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                                        file ? "bg-primary/10" : "bg-muted"
                                    )}>
                                        <FileSpreadsheet className={cn(
                                            "h-8 w-8",
                                            file ? "text-primary" : "text-muted-foreground"
                                        )} />
                                    </div>
                                    <p className="text-lg font-medium mb-2">
                                        {file ? file.name : "Drop your CSV file here"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        or click to browse files
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                        disabled={uploadMutation.isPending}
                                    />
                                    <label htmlFor="file-upload">
                                        <Button variant="outline" asChild disabled={uploadMutation.isPending}>
                                            <span>Browse Files</span>
                                        </Button>
                                    </label>
                                </div>
                            </div>

                            {/* Selected File + Actions */}
                            {file && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="h-10 w-10 text-primary flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClear}
                                            disabled={uploadMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={handleUpload}
                                            disabled={uploadMutation.isPending}
                                            className="flex-1 sm:flex-none"
                                        >
                                            {uploadMutation.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <UploadIcon className="h-4 w-4 mr-2" />
                                                    Upload & Process
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Progress Bar */}
                            {uploadMutation.isPending && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Processing...</span>
                                        <span className="font-medium">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {uploadMutation.isError && (
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 text-destructive">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Upload Failed</p>
                                        <p className="text-sm mt-1">
                                            {uploadMutation.error?.message || "An error occurred during upload"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upload Result */}
                    {result && (
                        <Card className={cn(
                            "glass-card border-2 mt-6",
                            result.success && result.rows_failed === 0 ? "border-success/50" :
                                result.rows_failed > 0 ? "border-warning/50" : "border-destructive/50"
                        )}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {result.success && result.rows_failed === 0 ? (
                                        <CheckCircle className="h-5 w-5 text-success" />
                                    ) : result.rows_failed > 0 ? (
                                        <AlertCircle className="h-5 w-5 text-warning" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-destructive" />
                                    )}
                                    Upload {result.success ? "Complete" : "Failed"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 rounded-lg bg-muted/50">
                                        <p className="text-2xl font-bold">{result.rows_processed}</p>
                                        <p className="text-sm text-muted-foreground">Processed</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-success/10">
                                        <p className="text-2xl font-bold text-success">{result.rows_inserted}</p>
                                        <p className="text-sm text-muted-foreground">Inserted</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-primary/10">
                                        <p className="text-2xl font-bold text-primary">{result.rows_updated}</p>
                                        <p className="text-sm text-muted-foreground">Updated</p>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-destructive/10">
                                        <p className="text-2xl font-bold text-destructive">{result.rows_failed}</p>
                                        <p className="text-sm text-muted-foreground">Failed</p>
                                    </div>
                                </div>

                                {result.errors && result.errors.length > 0 && (
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="font-medium">Errors ({result.errors.length})</p>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Export Errors
                                            </Button>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border p-2">
                                            {result.errors.slice(0, 10).map((err, i) => (
                                                <div
                                                    key={i}
                                                    className="text-sm p-2 rounded bg-destructive/5 flex items-start gap-2"
                                                >
                                                    <Badge variant="destructive" className="shrink-0">
                                                        Row {err.row_number}
                                                    </Badge>
                                                    <span className="text-muted-foreground">{err.error}</span>
                                                </div>
                                            ))}
                                            {result.errors.length > 10 && (
                                                <p className="text-sm text-muted-foreground text-center py-2">
                                                    ...and {result.errors.length - 10} more errors
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Format Guide */}
                <div>
                    <Card className="glass-card sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-base">Expected CSV Format</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Upload transaction data with the following columns:
                            </p>

                            <div className="space-y-2">
                                {[
                                    { col: "transaction_id", req: true, desc: "Unique ID" },
                                    { col: "merchant_code", req: true, desc: "Merchant ID" },
                                    { col: "customer_code", req: true, desc: "Customer ID" },
                                    { col: "amount", req: true, desc: "Transaction amount" },
                                    { col: "transaction_date", req: true, desc: "Date/datetime" },
                                    { col: "merchant_name", req: false, desc: "Display name" },
                                    { col: "category", req: false, desc: "Business category" },
                                    { col: "payment_method", req: false, desc: "Payment type" },
                                ].map((row) => (
                                    <div key={row.col} className="flex items-center gap-2 text-sm">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            row.req ? "bg-primary" : "bg-muted-foreground/30"
                                        )} />
                                        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                            {row.col}
                                        </code>
                                        <span className="text-muted-foreground text-xs">{row.desc}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground mb-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1" />
                                    Required columns
                                </p>
                                <Button variant="outline" size="sm" className="w-full" onClick={downloadSampleCSV}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Sample CSV
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
