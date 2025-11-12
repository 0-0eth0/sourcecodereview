export class OrderModal {
    dealerId: string;
    incoGroup: string;
    transType: string;
    material: productlist[];
    productType: string;
    shipToParty: ShippedPartyList[];
    plant: "";
    plantName: "";
}
export class ShippingParty {
    dapId: string;
    dealerId: string;
    isChecked: boolean;
};
export class ShippedPartyList {
    dapId: string;
    partyId: string;
    address: string;
    isSelected: boolean;
    partyName: string;
    quantity: string;
    region: string;
    orderId: string;
}
export class productlist {
    productName: string;
    productCode: string;
    quantity: string;
    orderId: string;
}
export class l1Mapping {
    customerLzone: string;
    distance: string;
    districtCode: string;
    ialesOrg: string;
    incoGroup: string;
    incoterm: string;
    l1Level: string;
    material: string;
    plant: string;
    plantDesc: string;
    plantType: string;
    quantity: string
    setId: string;
    travelTime: string;
}
