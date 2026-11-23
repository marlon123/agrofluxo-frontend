import { AlertCircle, LoaderCircle } from 'lucide-react'
export function LoadingState() { return <div className="resource-feedback"><LoaderCircle className="spin" size={22} /><span>Carregando registros...</span></div> }
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="resource-feedback error-feedback"><AlertCircle size={22} /><span>{message}</span><button className="button secondary" onClick={onRetry}>Tentar novamente</button></div> }
