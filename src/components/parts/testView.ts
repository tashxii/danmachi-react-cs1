import { CsTextBoxItem, CsView, CsViewBuilder } from "../../framework/cs";
import { CsCheckBoxItem, CsPasswordBoxItem, CsRadioBoxItem, CsSelectBoxItem, CsTextAreaItem } from "../../framework/cs";

export class TestView extends CsView {
    name = CsTextBoxItem.Default
    password = CsPasswordBoxItem.Default
    adminCheck = CsCheckBoxItem.Default
    genderSelect = CsSelectBoxItem.Default
    contactWay = CsRadioBoxItem.Default
    memo = CsTextAreaItem.Default
    other1 = CsTextBoxItem.Default
    other2 = CsTextBoxItem.Default
    other3 = CsTextBoxItem.Default
    other4 = CsTextBoxItem.Default
    other5 = CsTextBoxItem.Default
    other6 = CsTextBoxItem.Default
    other7 = CsTextBoxItem.Default
    other8 = CsTextBoxItem.Default
    other9 = CsTextBoxItem.Default
}

const builder =new CsViewBuilder
const testView = builder.build<TestView>(
    TestView,
    undefined,
    {
        readonly: false,
        name: new CsTextBoxItem(""),
        password: new CsPasswordBoxItem(""),
        adminCheck: new CsCheckBoxItem(false, "管理者"),
        contactWay: new CsRadioBoxItem("contactWay", "mail", ["mail","tel"]),
        genderSelect: new CsSelectBoxItem("no answer", ["man","woman","no answer"]),
        memo: new CsTextAreaItem(""),
        other1: new CsTextBoxItem("1"),
        other2: new CsTextBoxItem("2"),
        other3: new CsTextBoxItem("3"),
        other4: new CsTextBoxItem("4"),
        other5: new CsTextBoxItem("5"),
        other6: new CsTextBoxItem("6"),
        other7: new CsTextBoxItem("7"),
        other8: new CsTextBoxItem("8"),
        other9: new CsTextBoxItem("9")
    }
)

export default testView;