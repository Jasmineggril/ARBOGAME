import { useRef, useState, ChangeEvent } from "react";
import { Upload, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFileToStorage } from "./admin-utils";
import { useToast } from "@/hooks/use-toast";

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  value?: string | null;
  onChange(objectPath: string | null): void;
}

export function FileUploadField({ label, accept, value, onChange }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFileToStorage(file);
      onChange(result.objectPath);
      toast({ title: "Arquivo enviado", description: file.name });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro no upload";
      toast({ title: "Falha no upload", description: msg, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : value ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" /> Substituir arquivo
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Enviar arquivo
            </>
          )}
        </Button>
        {value ? (
          <span className="truncate text-xs text-muted-foreground">{value}</span>
        ) : (
          <span className="text-xs text-muted-foreground">Nenhum arquivo</span>
        )}
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remover
          </Button>
        ) : null}
      </div>
    </div>
  );
}
