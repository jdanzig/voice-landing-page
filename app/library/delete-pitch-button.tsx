"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  name: string;
};

export default function DeletePitchButton({ id, name }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function onDelete() {
    const confirmed = window.confirm(`Delete "${name}" from your pitch library?`);
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setIsDeleting(false);
      window.alert("Could not delete that pitch. Please try again.");
      return;
    }

    router.refresh();
  }

  return (
    <button className="danger-button" disabled={isDeleting} onClick={onDelete} type="button">
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
