import type { UaType } from '@type/UaType'
import autoBind from 'auto-bind'
import { getUaData } from 'umaki'

/**
 * UA情報をhtml要素にデータ属性として追加
 */
class AddUaData {
  constructor() {
    autoBind(this)

    const clientData = getUaData()

    this.addDataset(clientData)
  }

  addDataset(data: UaType): void {
    Object.entries(data).forEach(([key, value]) => {
      document.getElementsByTagName('html')[0].dataset[key.toLowerCase()] =
        typeof value === 'boolean' ? value.toString() : value
    })
  }
}

export default AddUaData
