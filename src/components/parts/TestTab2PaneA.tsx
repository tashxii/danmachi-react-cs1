import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import testView, { useTestView } from "./testView"

export const TestTab2PaneA: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 3,
    rowSize: 10,
    useAntd: true,
    view: view
  }
  return (
    <CxTableLayout {...props} />
  )
}