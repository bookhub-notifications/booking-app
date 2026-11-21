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

            title:
              `${slot.service_title} ${slot.start_time.slice(
                0,
                5
              )}`,

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

  async function handleSelectEvent(
  event
) {
  console.log(event.resource);
  if (
    event.resource.status ===
    "booked"
  ) {
    const confirmFree =
      window.confirm(
        "Questo slot è prenotato.\n\nVuoi liberarlo?"
      );

    if (!confirmFree) {
      return;
    }

    try {
      await freeSlot(
        event.resource
          .reservation_id
      );

      alert(
        "Slot liberato con successo"
      );

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Errore durante la liberazione dello slot"
      );
    }

    return;
  }

  const confirmDelete =
    window.confirm(
      "Vuoi eliminare questo slot?"
    );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteSlot(event.id);

    alert("Slot eliminato");

    await loadData();
  } catch (error) {
    console.error(error);

    alert(
      "Errore durante l'eliminazione"
    );
  }
}

  function eventStyleGetter(
    event
  ) {
    return {
      style: {
        backgroundColor:
          event.resource.status ===
          "booked"
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
    </Layout>
  );
}