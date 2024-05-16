export const mapUtil = {
  getModelUserData: (object: any): any => {
    if (!object) return null
    if (object.name === 'threeboxObject') {
      return object.userData.id
    } else {
      return mapUtil.getModelUserData(object.parent)
    }
  },
}
