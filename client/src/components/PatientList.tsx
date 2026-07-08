import type { Patient } from "../types/patient";

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

export default function PatientList({ patients, onSelect }: PatientListProps) {
  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <button
          key={patient.id}
          onClick={() => onSelect(patient)}
          className="w-full rounded-lg border bg-white p-4 text-left shadow hover:bg-blue-50"
        >
          <h3 className="font-semibold">{patient.name}</h3>

          <p className="text-sm text-gray-500">{patient.roomNumber}</p>
        </button>
      ))}
    </div>
  );
}
