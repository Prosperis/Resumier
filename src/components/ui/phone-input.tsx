import { ChevronDown } from "lucide-react";
import { forwardRef, useCallback, useState } from "react";
import {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  getCountries,
  getCountryCallingCode,
  type Country,
  type E164Number,
} from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import {
  parsePhoneNumber,
  AsYouType,
} from "libphonenumber-js";
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
      placeholder = "Enter phone number",
      className,
      defaultCountry = "US",
      name,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
    },
    ref
  ) => {
    const [country, setCountry] = useState<Country>(defaultCountry);

    // Format the input value as user types
    const formatInput = useCallback(
      (inputValue: string) => {
        if (!inputValue) return "";
        
        // Use AsYouType formatter for real-time formatting
        const formatter = new AsYouType(country);
        return formatter.input(inputValue);
      },
      [country]
    );

    // Get the display value (formatted for the current country)
    const getDisplayValue = useCallback(() => {
      if (!value) return "";
      
      try {
        // Try to parse and format the stored value
        const parsed = parsePhoneNumber(value);
        if (parsed) {
          // If the stored number's country matches selected, show national format
          if (parsed.country === country) {
            return parsed.formatNational();
          }
          // Otherwise show international
          return parsed.formatInternational();
        }
      } catch {
        // If parsing fails, just show the raw value
      }
      
      return value.replace(/^\+\d+\s*/, ""); // Remove country code prefix if present
    }, [value, country]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove all non-digit characters for processing
      const digitsOnly = inputValue.replace(/\D/g, "");
      
      if (!digitsOnly) {
        onChange?.("");
        return;
      }

      // Format with country code for storage
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
      
      // If there's an existing value, reformat it with the new country code
      if (value) {
        try {
          const parsed = parsePhoneNumber(value);
          if (parsed) {
            const nationalNumber = parsed.nationalNumber;
            const newCountryCode = getCountryCallingCode(newCountry);
            const newFullNumber = `+${newCountryCode}${nationalNumber}`;
            onChange?.(newFullNumber);
          }
        } catch {
          // Keep existing value if parsing fails
        }
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
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Phone number input */}
        <input
          ref={ref}
          type="tel"
          data-slot="input"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-full min-w-0 flex-1 rounded-r-md border bg-transparent px-3 py-1 text-xs shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
export type { PhoneInputProps };
