import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PageNav({ current, total, onChange }) {
  console.log("total", total);
  return(
    <div className="flex gap-2 mt-4 justify-center">
      <Button variant="outline" className="border-blue-200 text-blue-600" disabled={current === 1} onClick={() => onChange(current - 1)}><ArrowLeft /></Button>
      {[...Array(total)].map((_, idx) => (
        <Button
            variant="outline"
            key={idx}
            className={current === idx + 1 ? 'font-bold border-blue-200 text-blue-600' : ''}
            onClick={() => onChange(idx + 1)}
        >
            {idx + 1}
        </Button>
       ))}
      <Button variant="outline" className="border-blue-200 text-blue-600" disabled={current === total} onClick={() => onChange(current + 1)}><ArrowRight /></Button>
    </div>
  );
}