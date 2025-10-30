import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedInUrl: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onLinkedInUrlChange: (v: string) => void;
  onImport: () => void;
  importing: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function BasicInfoSection({
  name,
  email,
  phone,
  address,
  linkedInUrl,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  onLinkedInUrlChange,
  onImport,
  importing,
  onSave,
}: BasicInfoProps) {
  return (
    <form className="grid gap-4" onSubmit={onSave}>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="555-555-5555"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Your address"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
        <Input
          id="linkedin"
          value={linkedInUrl}
          onChange={(e) => onLinkedInUrlChange(e.target.value)}
          placeholder="https://www.linkedin.com/in/username"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onImport}
          disabled={importing}
        >
          Import from LinkedIn
        </Button>
      </div>
      <Button type="submit" className="mt-2 w-full">
        Save
      </Button>
    </form>
  );
}
