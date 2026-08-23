import { Star } from "lucide-react";

interface Props {
    rating: number
    max?: number
    size?: number
    interactive?: boolean
    onChange?: (rating: number) => void
}

export default function StarRating({
    rating,
    max=5,
    size=16,
    interactive,
    onChange
}: Props) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <Star 
                    key={i}
                    size={size}
                    className={`
                        ${i < rating ? "fill-yellow-400 text-yellow-400": "text-gray-600"}
                        ${interactive ? "cursor-pointer hover:text-yellow-400 transition-colors": ""}    
                    `}
                    onClick={() => interactive && onChange?.(i+1)}
                />
            ))}    
        </div>
    )
}
