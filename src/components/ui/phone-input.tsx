import { ChevronDown } from "lucide-react";
import { forwardRef, useCallback, useMemo, useState } from "react";
import {
  getCountries,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input";
import {
  parsePhoneNumber,
  AsYouType,
  getExampleNumber,
  type Examples,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  defaultCountry?: Country;
  name?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      disabled,
      placeholder,
      className,
      defaultCountry = "US",
      name,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
    },
    ref,
  ) => {
    const [country, setCountry] = useState<Country>(defaultCountry);

    // Generate dynamic placeholder based on country
    const dynamicPlaceholder = useMemo(() => {
      if (placeholder) return placeholder;
      try {
        const example = getExampleNumber(country, examples as Examples);
        if (example) {
          return example.formatNational();
        }
      } catch {
        // Fallback
      }
      return "(555) 123-4567";
    }, [country, placeholder]);

    // Get the display value - always format with AsYouType for consistent formatting
    const getDisplayValue = useCallback(() => {
      if (!value) return "";

      // Extract national number from stored E.164 value
      const countryCode = getCountryCallingCode(country);
      const countryCodePrefix = `+${countryCode}`;

      let nationalPart = "";
      if (value.startsWith(countryCodePrefix)) {
        nationalPart = value.slice(countryCodePrefix.length);
      } else if (value.startsWith("+")) {
        // Different country code - extract digits after code
        nationalPart = value.replace(/^\+\d{1,3}/, "");
      } else {
        nationalPart = value;
      }

      // Always use AsYouType for consistent formatting (works for partial numbers too)
      const formatter = new AsYouType(country);
      return formatter.input(nationalPart);
    }, [value, country]);

    // Handle input change - user is editing the national number only
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Remove all non-digit characters for processing
      const digitsOnly = inputValue.replace(/\D/g, "");

      if (!digitsOnly) {
        onChange?.("");
        return;
      }

      // Format with country code for storage (E.164 format)
      const countryCode = getCountryCallingCode(country);
      const fullNumber = `+${countryCode}${digitsOnly}`;

      try {
        const parsed = parsePhoneNumber(fullNumber);
        if (parsed && parsed.isValid()) {
          onChange?.(parsed.format("E.164"));
        } else {
          // Store the formatted number even if not fully valid yet
          onChange?.(fullNumber);
        }
      } catch {
        onChange?.(fullNumber);
      }
    };

    // Handle country change
    const handleCountryChange = (newCountry: Country) => {
      setCountry(newCountry);

      // If there's an existing value, clear it - national numbers have different
      // meanings across countries and cannot be safely reused.
      // e.g., UK +442071234567 → US +12071234567 would be a different person's number
      if (value) {
        onChange?.("");
      }
    };

    const countries = getCountries();

    return (
      <div className={cn("flex w-full items-stretch", className)}>
        {/* Country selector */}
        <div className="relative flex-shrink-0">
          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value as Country)}
            disabled={disabled}
            className={cn(
              "border-input bg-muted/50 dark:bg-input/30 h-8 w-[88px] cursor-pointer appearance-none rounded-l-md border border-r-0 py-1 pr-6 pl-2 text-xs shadow-xs outline-none transition-colors",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            )}
            aria-label="Select country"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c} +{getCountryCallingCode(c)}
              </option>
            ))}
          </select>
          <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2" />
        </div>

        {/* Phone number input - shows national format only */}
        <div className="relative flex-1">
          <input
            ref={ref}
            type="tel"
            data-slot="input"
            value={getDisplayValue()}
            onChange={handleInputChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={dynamicPlaceholder}
            name={name}
            id={id}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            className={cn(
              "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-full min-w-0 rounded-r-md border bg-transparent py-1 pl-3 pr-3 text-xs shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            )}
          />
        </div>
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
export type { PhoneInputProps };
