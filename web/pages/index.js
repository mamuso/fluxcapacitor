import * as pluralize from "pluralize";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function HomePage({ pages }) {
  return (
    <div>
      <ul>
        {pages.map((page) => (
          <li>
            <Link href="/capture/[slug]" as={`/capture/${page.slug}`}>
              <a>{page.slug}</a>
            </Link>
            {page.reportcount} {pluralize("capture", page.reportcount)} from{" "}
            {new Date(page.startsAt).toDateString()} to{" "}
            {new Date(page.endsAt).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps = async () => {
  const pages = await prisma.page.findMany({
    orderBy: { slug: "asc" },
    select: {
      id: true,
      slug: true,
      startsAt: true,
      endsAt: true,
      reportcount: true,
    },
  });

  return {
    props: { pages },
  };
};

export default HomePage;
