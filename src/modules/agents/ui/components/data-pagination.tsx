import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const DataPagination = ({
  page,
  totalPages,
  onPageChange,
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-[#6B5C4C] font-bold">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-3 py-4">
        <Button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="bg-[#E1DCC9] hover:bg-[#D8D1BE] disabled:hover:bg-[#E1DCC9] disabled:opacity-50 text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] disabled:translate-none disabled:shadow-[2px_2px_0px_0px_#412D15] rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer h-9"
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="bg-[#E1DCC9] hover:bg-[#D8D1BE] disabled:hover:bg-[#E1DCC9] disabled:opacity-50 text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] disabled:translate-none disabled:shadow-[2px_2px_0px_0px_#412D15] rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer h-9"
        >
          Next
        </Button>
      </div>
    </div>
  );
};