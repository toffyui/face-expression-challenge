import React, { useEffect } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Loader from "../../../../../components/Loader";
import useTranlate from "../../../../../hooks/useTranslate";

type Props = {
  mode: string;
  all: string;
  point: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  if (
    typeof context.params?.mode === "string" &&
    typeof context.params?.all === "string" &&
    typeof context.params?.point === "string"
  ) {
    return {
      props: {
        mode: context.params?.mode,
        all: context.params?.all,
        point: context.params?.point,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

const Page = ({ mode, all, point }: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const router = useRouter();
  const { locale } = useRouter();
  useEffect(() => {
    locale === "ja" ? router.push("/ja") : router.push("/");
  }, []);
  const t = useTranlate();

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta name="description" content={t.metaDesc} />
        <meta property="og:site_name" content={t.title} />
        <link rel="icon" href="/emojis/happy.png" />
        <meta name="twitter:site" content="@yui_active" />
        <meta
          property="og:image"
          key="ogImage"
          content={`${baseUrl}/api/ogp?mode=${mode}&all=${all}&point=${point}&la=${locale}`}
        />
        <meta
          name="twitter:card"
          key="twitterCard"
          content="summary_large_image"
        />
        <meta
          name="twitter:image"
          key="twitterImage"
          content={`${baseUrl}/api/ogp?mode=${mode}&all=${all}&point=${point}&la=${locale}`}
        />
      </Head>
      <Loader />
    </>
  );
};
export default Page;
