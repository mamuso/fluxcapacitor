import * as pluralize from "pluralize";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
  const report = await prisma.report.findMany({
    where: {
      current: true,
      visible: true,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      captures: {
        orderBy: {
          slug: "asc",
        },
        select: {
          slug: true,
          urlmin: true,
          page: {
            select: {
              slug: true,
              reportcount: true,
            },
          },
          device: {
            select: {
              id: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const devices = await prisma.device.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
    },
  });
  return {
    props: { report, devices },
  };
};

export default HomePage;
