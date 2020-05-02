import * as pluralize from "pluralize";
import Link from "next/link";
import * as DB from "~/lib/db";
import Layout from "~/components/Layout";
import CaptureGrid from "~/components/CaptureGrid";
import CaptureCard from "~/components/CaptureCard";

function HomePage({ report, devices }) {
  return (
    <Layout>
      {devices.map((device) => (
        <div>
          <h1>{device.slug}</h1>
          <CaptureGrid>
            {report[0].captures
              .filter((c) => c.device.id === device.id)
              .map((c) => (
                <CaptureCard capture={c} />
              ))}
          </CaptureGrid>
        </div>
      ))}
    </Layout>
  );
}
export const getServerSideProps = async () => {
  const report = await DB.getCurrent();
  const devices = await DB.getDevices();

  return {
    props: { report, devices },
  };
};

export default HomePage;
