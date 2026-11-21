import { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";

import {
  createSlot,
  deleteSlot,
  getMyServices,
  getMySlots,
  freeSlot,
} from "../../api/provider";

import Layout from "../../components/Layout";

const localizer =
  momentLocalizer(moment);

export default function CreateSlot() {
  const [services, setServices] =
    useState([]);

  const [slots, setSlots] =
    useState([]);

  const [serviceId, setServiceId] =
    useState("");

  const [view, setView] =
    useState("month");

  const [currentDate, setCurrentDate] =
    useState(new Date());
const [selectedEvent, setSelectedEvent] =
  useState(null);

const [showModal, setShowModal] =
  useState(false);
  async function loadData() {
    try {
      const servicesResponse =
        await getMyServices();

      setServices(
        servicesResponse.data || []
      );

      const slotsResponse =
  await getMySlots();

console.log(slotsResponse.data);

const events =
  slotsResponse.data.map(
    (slot) => ({
      id: slot.id,

      // Solo icona nel calendario
      title: "",

      start: new Date(
        `${slot.slot_date.split("T")[0]}T${slot.start_time}`
      ),

      end: new Date(
        `${slot.slot_date.split("T")[0]}T${slot.end_time}`
      ),

      resource: slot,
    })
  );

      setSlots(events);

      if (events.length > 0) {
        setCurrentDate(
          events[0].start
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSelectSlot(
    slotInfo
  ) {
    if (!serviceId) {
      alert(
        "Seleziona prima un servizio"
      );
      return;
    }

    try {
      const slotDate =
        moment(
          slotInfo.start
        ).format("YYYY-MM-DD");

      const startTime =
        moment(
          slotInfo.start
        ).format("HH:mm");

      const endTime =
        moment(
          slotInfo.end
        ).format("HH:mm");

      await createSlot(
        serviceId,
        slotDate,
        startTime,
        endTime
      );

      alert("Slot creato!");

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.error ||
          "Errore durante la creazione dello slot"
      );
    }
  }
function handleSelectEvent(event) {
  setSelectedEvent(event);
  setShowModal(true);
}

async function handleDeleteSlot() {
  try {
    await deleteSlot(selectedEvent.id);

    setShowModal(false);

    await loadData();
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.error ||
      "Errore durante l'eliminazione"
    );
  }
}

async function handleFreeSlot() {
  try {
    await freeSlot(
      selectedEvent.resource.reservation_id
    );

    setShowModal(false);

    await loadData();
  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.error ||
      "Errore durante la liberazione"
    );
  }
}

function eventStyleGetter(event) {
  return {
    style: {
      backgroundColor:
        event.resource.status === "booked"
          ? "#ef4444"
          : "#22c55e",

      borderRadius: "6px",
      border: "none",
      color: "#fff",
    },
  };
}
  return (
    <Layout>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          Calendario Slot
        </h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Servizio
          </label>

          <select
            className="border p-2 w-full"
            value={serviceId}
            onChange={(e) =>
              setServiceId(
                e.target.value
              )
            }
          >
            <option value="">
              Seleziona un servizio
            </option>

            {services.map(
              (service) => (
                <option
                  key={service.id}
                  value={
                    service.id
                  }
                >
                  {service.title}
                </option>
              )
            )}
          </select>
        </div>

        <div
          style={{
            height: "700px",
          }}
        >
          <Calendar
            localizer={
              localizer
            }
            events={slots}
            startAccessor="start"
            endAccessor="end"
            selectable
            popup
            step={30}
            views={[
              "month",
              "week",
              "day",
              "agenda",
            ]}
            view={view}
            onView={(newView) =>
              setView(newView)
            }
            date={currentDate}
            onNavigate={(
              newDate
            ) =>
              setCurrentDate(
                newDate
              )
            }
            onSelectSlot={
              handleSelectSlot
            }
            onSelectEvent={
              handleSelectEvent
            }
            eventPropGetter={
              eventStyleGetter
            }
          />
        </div>
<div className="mt-4 flex gap-4 text-sm">
  <span>
    🟢 Disponibile
  </span>

  <span>
    🔴 Prenotato
  </span>
</div>
</div>
{showModal && selectedEvent && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold text-center mb-4">
        📅 {selectedEvent.resource.service_title}
      </h3>

      <p className="mb-2">
        <strong>Orario:</strong>{" "}
        {selectedEvent.resource.start_time.slice(0, 5)}
        {" - "}
        {selectedEvent.resource.end_time.slice(0, 5)}
      </p>

      <p className="mb-4">
        <strong>Stato:</strong>{" "}
        {selectedEvent.resource.status === "booked"
          ? "🔴 Prenotato"
          : "🟢 Disponibile"}
      </p>

      {selectedEvent.resource.status === "booked" ? (
        <button
          onClick={handleFreeSlot}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 transition"
        >
          🔓 Libera Slot
        </button>
      ) : (
        <button
          onClick={handleDeleteSlot}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2 transition"
        >
          Elimina Slot
        </button>
      )}
      <button
        onClick={() => setShowModal(false)}
        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
      >
        Chiudi
      </button>
    </div>
  </div>
)}

  </Layout>
);
}
      