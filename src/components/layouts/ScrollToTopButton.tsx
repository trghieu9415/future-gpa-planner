import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShowScrollToTop } from "@/hooks/useShowScrollToTop";
import { cn } from "@/lib/utils";

export const ScrollToTopButton = () => {
  const show = useShowScrollToTop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed z-50 p-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-all duration-300 bottom-4",
        show ? "right-4" : "right-[-100%]"
      )}
      size="icon"
    >
      <ArrowUp size={20} />
    </Button>
  );
};
