import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { useFindAllAccountCodesQuery } from "@/lib/api/accountCodeApi";

export function AccountCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = useFindAllAccountCodesQuery();

  const selectedAccount = data?.find((acc) => acc.ID.toString() === value);

  console.log("selected account ", selectedAccount);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAccount
            ? `${selectedAccount.ACCOUNT_TITLE}`
            : "Find account code"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search account code..." className="h-9" />
          <CommandList>
            <CommandEmpty>No account code found.</CommandEmpty>
            <CommandGroup>
              {data?.map((accCode) => (
                <CommandItem
                  key={accCode.ID}
                  value={`${accCode.ACCOUNT_TITLE} ${accCode.ACCOUNT_CODE}`}
                  onSelect={() => {
                    onChange(accCode.ID.toString()); // 🔹 send selected value to parent
                    setOpen(false);
                  }}
                >
                  {accCode.ACCOUNT_TITLE}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === accCode.ID.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
