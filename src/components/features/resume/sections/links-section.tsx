import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Link } from "@/stores";

interface LinksProps {
  customUrl: string;
  links: Link[];
  setCustomUrl: (v: string) => void;
  addLink: () => void;
  updateLink: (i: number, field: keyof Link, value: string) => void;
  removeLink: (i: number) => void;
}

export function LinksSection({
  customUrl,
  links,
  setCustomUrl,
  addLink,
  updateLink,
  removeLink,
}: LinksProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="custom-url">Custom URL</Label>
        <Input
          id="custom-url"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="yourname"
        />
      </div>
      {links.map((link, i) => (
        <div key={i} className="grid gap-2 rounded-md border p-4">
          <div className="grid gap-2">
            <Label>Label</Label>
            <Input
              value={link.label ?? ""}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="LinkedIn"
            />
          </div>
          <div className="grid gap-2">
            <Label>URL</Label>
            <Input
              value={link.url ?? ""}
              onChange={(e) => updateLink(i, "url", e.target.value)}
              placeholder="https://linkedin.com/in/you"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeLink(i)}>
            <Trash className="mr-2 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addLink}>
        <Plus className="mr-2 h-4 w-4" /> Add Link
      </Button>
    </div>
  );
}
