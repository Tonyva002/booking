import { useState } from "react";

interface ClientFormProps {
  onCreateClient: (
    name: string,
    email: string,
    phone: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

export const ClientForm = ({ onCreateClient }: ClientFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");
    setFormSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setFormError("All fields are required");
      return;
    }

    setIsCreatingClient(true);

    try {
      const result = await onCreateClient(
        trimmedName,
        trimmedEmail,
        trimmedPhone,
      );

      if (!result.success) {
        setFormError(result.message || "Failed to create client");
        return;
      }

      setFormSuccess(result.message || "Client created successfully");
      setName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Client form error:", error);
      setFormError("Unexpected error while creating client");
    } finally {
      setIsCreatingClient(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Create New Client</h2>
        <p className="text-sm text-gray-500 mt-1">
          Create a new client to book appointments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client full name"
            className="w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@email.com"
            className="w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="809-000-0000"
            className="w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {formSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={isCreatingClient}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCreatingClient ? "Creating..." : "Create Client"}
        </button>
      </form>
    </div>
  );
};