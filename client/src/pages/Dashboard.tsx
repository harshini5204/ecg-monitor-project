import { usePatients } from "../hooks/usePatients";
import PatientCard from "../components/PatientCard";

export default function Dashboard() {
  const { patients } = usePatients();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="mb-8 text-5xl font-bold text-green-500">
        ECG Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
