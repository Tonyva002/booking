import React, { useEffect, useState } from "react";
import { useProviderAvailabilityViewModel } from "./useProviderAvailabilityViewModel";

import { ClientForm } from "../../components/ClientForm";
import { ProviderForm } from "../../components/ProviderForm";
import { AvailabilityFilters } from "../../components/AvailabilityFilters";
import { AvailabilityTable } from "../../components/AvailabilityTable";
import { BookingModal } from "../../components/BookingModal";

export const ProviderAvailabilityPage: React.FC = () => {
  const {
    providers,
    clients,
    availability,
    loadingProviders,
    loadingAvailability,
    fetchProviders,
    fetchClients,
    fetchAvailability,
    createClient,
    createProvider,
    book,
    getProviderName,
    getClientName,
  } = useProviderAvailabilityViewModel();

  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const loadAvailability = async () => {
    if (!selectedProvider || !date) return;
    await fetchAvailability(selectedProvider, date);
  };

  const handleCreateClient = async (
    name: string,
    email: string,
    phone: string,
  ) => {
    const result = await createClient(name, email, phone);

    if (result.success) {
      await fetchClients();
    }

    return result;
  };

  const handleCreateProvider = async (
    name: string,
    maxBookingsPerDay: number,
  ) => {
    const result = await createProvider(name, maxBookingsPerDay);

    if (result.success) {
      await fetchProviders();
    }

    return result;
  };

  const validateBooking = () => {
    if (!selectedClient) return "Select a client";
    if (!selectedProvider) return "Select a provider";
    if (!selectedBookingDate) return "Select a date";
    return null;
  };

  const openBookingDialog = (bookingDate: string) => {
    setSelectedBookingDate(bookingDate);
    setBookingError("");
    setIsBookingSubmitting(false);
    setIsBookingDialogOpen(true);
  };

  const closeBookingDialog = () => {
    setIsBookingDialogOpen(false);
    setSelectedBookingDate("");
    setBookingError("");
    setIsBookingSubmitting(false);
  };

  const handleConfirmBooking = async () => {
    const error = validateBooking();

    if (error) {
      setBookingError(error);
      return;
    }

    setIsBookingSubmitting(true);
    setBookingError("");

    const result = await book(
      selectedProvider!,
      selectedClient!,
      selectedBookingDate,
    );

    if (!result.success) {
      setBookingError(result.message ?? "Unable to complete booking.");
      setIsBookingSubmitting(false);
      return;
    }

    await fetchAvailability(selectedProvider!, date || selectedBookingDate);
    closeBookingDialog();
  };

  const selectedProviderName = getProviderName(selectedProvider);
  const selectedClientName = getClientName(selectedClient);

  return (
    <div className="space-y-8">
      <AvailabilityFilters
        providers={providers}
        clients={clients}
        loadingProviders={loadingProviders}
        selectedProvider={selectedProvider}
        selectedClient={selectedClient}
        date={date}
        onProviderChange={setSelectedProvider}
        onClientChange={setSelectedClient}
        onDateChange={setDate}
        onCheckAvailability={loadAvailability}
      />

      {bookingError && !isBookingDialogOpen && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {bookingError}
        </div>
      )}

      {loadingAvailability ? (
        <p>Loading availability...</p>
      ) : (
        <AvailabilityTable
          availability={availability}
          selectedClient={selectedClient}
          onBook={openBookingDialog}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientForm onCreateClient={handleCreateClient} />
        <ProviderForm onCreateProvider={handleCreateProvider} />
      </div>

      {/* MODAL */}
      <BookingModal
        isOpen={isBookingDialogOpen}
        title="Confirm Booking"
        description="Review the booking details"
        confirmText="Confirm Booking"
        error={bookingError}
        isSubmitting={isBookingSubmitting}
        onClose={closeBookingDialog}
        onConfirm={handleConfirmBooking}
      >
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <p>
            <b>Provider:</b> {selectedProviderName}
          </p>
          <p>
            <b>Client:</b> {selectedClientName}
          </p>
          <p>
            <b>Date:</b> {selectedBookingDate}
          </p>
        </div>
      </BookingModal>
    </div>
  );
};
