import * as pluralize from "pluralize";
import Link from "next/link";
import * as DB from "../lib/db";

function HomePage({ report, devices }) {
  return (
    <div>
      <style jsx>{`
        ul {
          margin: 16px;
        }
        li {
          display: inline-block;
          margin: 16px;
        }
        p {
          color: blue;
        }
      `}</style>
      {devices.map((device) => (
        <div>
          <h1>{device.slug}</h1>
          <ul>
            {report[0].captures
              .filter((c) => c.device.id === device.id)
              .map((c) => (
                <li>
                  <Link href="/page/[slug]" as={`/page/${c.page.slug}`}>
                    <a>
                      <img src={c.urlmin} width="220" />
                      <br />
                      <strong>{c.page.slug}</strong>
                      <br />
                      <span>{`${c.page.reportcount} ${pluralize(
                        "capture",
                        c.page.reportcount
                      )}`}</span>
                      <br />
                    </a>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
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
