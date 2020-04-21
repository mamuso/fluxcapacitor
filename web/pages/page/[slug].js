import * as pluralize from "pluralize";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function PagePage({ page }) {
  return (
    <div>
      <h1>{page.slug}</h1>
      <ul>
        {page.reports.map((report) => (
          <li>
            {report.slug} {report.current ? "(current)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const page = await prisma.page.findOne({
    where: { slug: `${ctx.params.slug}` },
    select: {
      id: true,
      slug: true,
      reports: { select: { slug: true, current: true } },
    },
  });
  return {
    props: { page },
  };
};

export default PagePage;
