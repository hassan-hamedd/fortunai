import { redirect } from "next/navigation";

// Redirect to the main client page since we've moved the trial balance there
const TrialBalancePage = ({ params }: { params: { id: string } }) => {
  redirect(`/clients/${params.id}`);
};

export default TrialBalancePage;
