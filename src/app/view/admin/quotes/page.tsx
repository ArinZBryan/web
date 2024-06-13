import { Suspense, } from "react"
import { RichQuote } from "@/app/api/db/types"
import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { ShowOnLogin } from "@/components/component/showonlogin"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as QuotesTable } from "./table"
import { SkeletonTable } from "./skeleton-table"
import { Reload } from "@/components/component/reload"
import { api, triggerServerSideReload } from "@/api"
export default async function Page() {

    let data: RichQuote[] = []

    data = await api.get.richquotes()


    return <div className="h-dvh">
        <SessionProvider>
            <TitleBar />
            <div className="w-full">
                <Suspense fallback={<SkeletonTable cols={8} />}>
                    <QuotesTable data={data as RichQuote[]} onTableInvalid={async () => {
                        "use server"
                        api.get.richquotes()
                            .then((res) => { data = res; triggerServerSideReload("/view/admin/quotes") })
                    }} />
                    <ScrollToTop />
                    <Reload onClick={async () => {
                        "use server"
                        api.get.richquotes()
                            .then((res) => { data = res; triggerServerSideReload("/view/admin/quotes") })
                    }} />
                </Suspense>
            </div>

        </SessionProvider>
        <div className="flex items-center justify-center" style={{ height: "-webkit-fill-available" }}>
            <span className="text-gray-700">There's Nothing Here...</span>
        </div>

    </div>
}