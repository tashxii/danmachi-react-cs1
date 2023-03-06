import { CxLayoutProps, CxTableLayout } from "../../framework/cx/CxLayout"
import testView, { useTestView } from "./testView"

export const TestTab3PaneA: React.FC = () => {
  const view = useTestView()
  const props: CxLayoutProps = {
    colSize: 2,
    rowSize: 10,
    useAx: true,
    view: view
  }
  return (
    <CxTableLayout {...props} />
  )
}