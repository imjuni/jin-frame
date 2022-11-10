[jin-frame](README.md) / Exports

# jin-frame

## Table of contents

### Classes

- [AbstractJinFrame](classes/AbstractJinFrame.md)
- [JinEitherFrame](classes/JinEitherFrame.md)
- [JinFile](classes/JinFile.md)
- [JinFrame](classes/JinFrame.md)
- [JinFrameError](classes/JinFrameError.md)

### Interfaces

- [IBodyField](interfaces/IBodyField.md)
- [IBodyFieldOption](interfaces/IBodyFieldOption.md)
- [ICommonFieldOption](interfaces/ICommonFieldOption.md)
- [IDebugInfo](interfaces/IDebugInfo.md)
- [IFailExceptionJinEitherFrame](interfaces/IFailExceptionJinEitherFrame.md)
- [IFailJinEitherFrame](interfaces/IFailJinEitherFrame.md)
- [IFailReplyJinEitherFrame](interfaces/IFailReplyJinEitherFrame.md)
- [IFormatter](interfaces/IFormatter.md)
- [IHeaderFieldOption](interfaces/IHeaderFieldOption.md)
- [IJinFrameCreateConfig](interfaces/IJinFrameCreateConfig.md)
- [IJinFrameRequestConfig](interfaces/IJinFrameRequestConfig.md)
- [IObjectBodyFieldOption](interfaces/IObjectBodyFieldOption.md)
- [IParamFieldOption](interfaces/IParamFieldOption.md)
- [IQueryFieldOption](interfaces/IQueryFieldOption.md)
- [IQueryParamCommonFieldOption](interfaces/IQueryParamCommonFieldOption.md)

### Type Aliases

- [ConstructorType](modules.md#constructortype)
- [JinConstructorType](modules.md#jinconstructortype)
- [JinOmitConstructorType](modules.md#jinomitconstructortype)
- [OmitConstructorType](modules.md#omitconstructortype)
- [TFieldRecords](modules.md#tfieldrecords)
- [TJinFail](modules.md#tjinfail)
- [TJinPass](modules.md#tjinpass)
- [TMultipleBodyFormatter](modules.md#tmultiplebodyformatter)
- [TMultipleObjectBodyFormatter](modules.md#tmultipleobjectbodyformatter)
- [TPassJinEitherFrame](modules.md#tpassjineitherframe)
- [TRequestPart](modules.md#trequestpart)
- [TSingleBodyFormatter](modules.md#tsinglebodyformatter)
- [TSingleObjectBodyFormatter](modules.md#tsingleobjectbodyformatter)

### Variables

- [defaultJinFrameTimeout](modules.md#defaultjinframetimeout)

### Functions

- [applyFormatters](modules.md#applyformatters)
- [bitwised](modules.md#bitwised)
- [encode](modules.md#encode)
- [encodes](modules.md#encodes)
- [getBodyInfo](modules.md#getbodyinfo)
- [getDefaultBodyFieldOption](modules.md#getdefaultbodyfieldoption)
- [getDefaultHeaderFieldOption](modules.md#getdefaultheaderfieldoption)
- [getDefaultObjectBodyFieldOption](modules.md#getdefaultobjectbodyfieldoption)
- [getDefaultParamFieldOption](modules.md#getdefaultparamfieldoption)
- [getDefaultQueryFieldOption](modules.md#getdefaultqueryfieldoption)
- [getHeaderInfo](modules.md#getheaderinfo)
- [getQueryParamInfo](modules.md#getqueryparaminfo)
- [isValidArrayType](modules.md#isvalidarraytype)
- [isValidPrimitiveType](modules.md#isvalidprimitivetype)
- [isValidateStatusDefault](modules.md#isvalidatestatusdefault)
- [processBodyFormatters](modules.md#processbodyformatters)
- [processObjectBodyFormatters](modules.md#processobjectbodyformatters)
- [removeBothSlash](modules.md#removebothslash)
- [removeEndSlash](modules.md#removeendslash)
- [removeStartSlash](modules.md#removestartslash)
- [startWithSlash](modules.md#startwithslash)
- [typeAssert](modules.md#typeassert)

## Type Aliases

### ConstructorType

Ƭ **ConstructorType**<`T`\>: `OmitType`<`T`, `Function`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/tools/ConstructorType.ts:19](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/ConstructorType.ts#L19)

___

### JinConstructorType

Ƭ **JinConstructorType**<`T`\>: `Omit`<[`ConstructorType`](modules.md#constructortype)<`T`\>, ``"host"`` \| ``"path"`` \| ``"method"`` \| ``"contentType"`` \| ``"customBody"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AbstractJinFrame`](classes/AbstractJinFrame.md) |

#### Defined in

[src/tools/ConstructorType.ts:23](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/ConstructorType.ts#L23)

___

### JinOmitConstructorType

Ƭ **JinOmitConstructorType**<`T`, `M`\>: `Omit`<[`ConstructorType`](modules.md#constructortype)<`T`\>, ``"host"`` \| ``"path"`` \| ``"method"`` \| ``"contentType"`` \| ``"customBody"`` \| `M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AbstractJinFrame`](classes/AbstractJinFrame.md) |
| `M` | extends keyof [`ConstructorType`](modules.md#constructortype)<`T`\> |

#### Defined in

[src/tools/ConstructorType.ts:28](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/ConstructorType.ts#L28)

___

### OmitConstructorType

Ƭ **OmitConstructorType**<`T`, `M`\>: `Omit`<[`ConstructorType`](modules.md#constructortype)<`T`\>, `M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `M` | extends keyof [`ConstructorType`](modules.md#constructortype)<`T`\> |

#### Defined in

[src/tools/ConstructorType.ts:21](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/ConstructorType.ts#L21)

___

### TFieldRecords

Ƭ **TFieldRecords**: `Record`<[`IParamFieldOption`](interfaces/IParamFieldOption.md)[``"type"``], { `key`: `string` ; `option`: [`IParamFieldOption`](interfaces/IParamFieldOption.md)  }[]\> & `Record`<[`IQueryFieldOption`](interfaces/IQueryFieldOption.md)[``"type"``], { `key`: `string` ; `option`: [`IQueryFieldOption`](interfaces/IQueryFieldOption.md)  }[]\> & `Record`<[`IBodyFieldOption`](interfaces/IBodyFieldOption.md)[``"type"``], { `key`: `string` ; `option`: [`IBodyFieldOption`](interfaces/IBodyFieldOption.md)  }[]\> & `Record`<[`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)[``"type"``], { `key`: `string` ; `option`: [`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)  }[]\>

#### Defined in

[src/interfaces/TFieldRecords.ts:6](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/TFieldRecords.ts#L6)

___

### TJinFail

Ƭ **TJinFail**<`T`\>: `IFail`<[`IFailExceptionJinEitherFrame`](interfaces/IFailExceptionJinEitherFrame.md)<`T`\> \| [`IFailReplyJinEitherFrame`](interfaces/IFailReplyJinEitherFrame.md)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/interfaces/IFailJinEitherFrame.ts:26](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/IFailJinEitherFrame.ts#L26)

___

### TJinPass

Ƭ **TJinPass**<`T`\>: `IPass`<[`TPassJinEitherFrame`](modules.md#tpassjineitherframe)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/interfaces/TPassJinEitherFrame.ts:12](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/TPassJinEitherFrame.ts#L12)

___

### TMultipleBodyFormatter

Ƭ **TMultipleBodyFormatter**: { `findFrom?`: `string`  } & [`IFormatter`](interfaces/IFormatter.md)[]

#### Defined in

[src/interfaces/body/IBodyFieldOption.ts:9](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/body/IBodyFieldOption.ts#L9)

___

### TMultipleObjectBodyFormatter

Ƭ **TMultipleObjectBodyFormatter**: { `findFrom`: `string`  } & [`IFormatter`](interfaces/IFormatter.md)[]

#### Defined in

[src/interfaces/body/IObjectBodyFieldOption.ts:9](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/body/IObjectBodyFieldOption.ts#L9)

___

### TPassJinEitherFrame

Ƭ **TPassJinEitherFrame**<`T`\>: `AxiosResponse`<`T`\> & { `$debug`: [`IDebugInfo`](interfaces/IDebugInfo.md) ; `$frame`: [`JinEitherFrame`](classes/JinEitherFrame.md)<`T`, `any`\> ; `$progress`: ``"pass"``  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/interfaces/TPassJinEitherFrame.ts:6](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/TPassJinEitherFrame.ts#L6)

___

### TRequestPart

Ƭ **TRequestPart**: [`IQueryFieldOption`](interfaces/IQueryFieldOption.md)[``"type"``] \| [`IParamFieldOption`](interfaces/IParamFieldOption.md)[``"type"``] \| [`IBodyFieldOption`](interfaces/IBodyFieldOption.md)[``"type"``] \| [`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)[``"type"``]

#### Defined in

[src/interfaces/TRequestPart.ts:6](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/TRequestPart.ts#L6)

___

### TSingleBodyFormatter

Ƭ **TSingleBodyFormatter**: { `findFrom?`: `string`  } & [`IFormatter`](interfaces/IFormatter.md)

#### Defined in

[src/interfaces/body/IBodyFieldOption.ts:4](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/body/IBodyFieldOption.ts#L4)

___

### TSingleObjectBodyFormatter

Ƭ **TSingleObjectBodyFormatter**: { `findFrom`: `string`  } & [`IFormatter`](interfaces/IFormatter.md)

#### Defined in

[src/interfaces/body/IObjectBodyFieldOption.ts:4](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/interfaces/body/IObjectBodyFieldOption.ts#L4)

## Variables

### defaultJinFrameTimeout

• `Const` **defaultJinFrameTimeout**: ``120000``

#### Defined in

[src/frames/defaultJinFrameTimeout.ts:1](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/frames/defaultJinFrameTimeout.ts#L1)

## Functions

### applyFormatters

▸ **applyFormatters**(`initialValue`, `formatter`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialValue` | `string` \| `number` \| `boolean` \| `Date` |
| `formatter` | [`IFormatter`](interfaces/IFormatter.md) |

#### Returns

`string`

#### Defined in

[src/tools/applyFormatters.ts:44](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/applyFormatters.ts#L44)

▸ **applyFormatters**(`initialValue`, `formatter`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialValue` | `string`[] \| `Date`[] \| `number`[] \| `boolean`[] |
| `formatter` | [`IFormatter`](interfaces/IFormatter.md) |

#### Returns

`string`[]

#### Defined in

[src/tools/applyFormatters.ts:45](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/applyFormatters.ts#L45)

___

### bitwised

▸ **bitwised**(`values`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `number`[] |

#### Returns

`number`

#### Defined in

[src/tools/bitwised.ts:1](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/bitwised.ts#L1)

___

### encode

▸ **encode**(`enable`, `value`): `string` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `enable` | `undefined` \| ``null`` \| `boolean` |
| `value` | `string` \| `number` |

#### Returns

`string` \| `number`

#### Defined in

[src/tools/encode.ts:1](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/encode.ts#L1)

___

### encodes

▸ **encodes**(`enable`, `values`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `enable` | `undefined` \| ``null`` \| `boolean` |
| `values` | `string` \| `number` |

#### Returns

`string`

#### Defined in

[src/tools/encode.ts:9](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/encode.ts#L9)

▸ **encodes**(`enable`, `values`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `enable` | `undefined` \| ``null`` \| `boolean` |
| `values` | `string`[] \| `number`[] |

#### Returns

`string`[]

#### Defined in

[src/tools/encode.ts:10](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/encode.ts#L10)

___

### getBodyInfo

▸ **getBodyInfo**<`T`\>(`thisFrame`, `fields`, `strict?`): `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `thisFrame` | `T` |
| `fields` | [`IBodyField`](interfaces/IBodyField.md)[] |
| `strict?` | `boolean` |

#### Returns

`any`

#### Defined in

[src/processors/getBodyInfo.ts:11](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getBodyInfo.ts#L11)

___

### getDefaultBodyFieldOption

▸ **getDefaultBodyFieldOption**(`option?`): [`IBodyFieldOption`](interfaces/IBodyFieldOption.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `option?` | `Partial`<[`IBodyFieldOption`](interfaces/IBodyFieldOption.md)\> \| `Except`<`Partial`<[`IBodyFieldOption`](interfaces/IBodyFieldOption.md)\>, ``"type"``\> |

#### Returns

[`IBodyFieldOption`](interfaces/IBodyFieldOption.md)

#### Defined in

[src/processors/getDefaultOption.ts:38](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getDefaultOption.ts#L38)

___

### getDefaultHeaderFieldOption

▸ **getDefaultHeaderFieldOption**(`option?`): [`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `option?` | `Partial`<[`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)\> \| `Omit`<`Partial`<[`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)\>, ``"type"``\> |

#### Returns

[`IHeaderFieldOption`](interfaces/IHeaderFieldOption.md)

#### Defined in

[src/processors/getDefaultOption.ts:92](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getDefaultOption.ts#L92)

___

### getDefaultObjectBodyFieldOption

▸ **getDefaultObjectBodyFieldOption**(`option?`): [`IObjectBodyFieldOption`](interfaces/IObjectBodyFieldOption.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `option?` | `Partial`<[`IObjectBodyFieldOption`](interfaces/IObjectBodyFieldOption.md)\> \| `Except`<`Partial`<[`IObjectBodyFieldOption`](interfaces/IObjectBodyFieldOption.md)\>, ``"type"``\> |

#### Returns

[`IObjectBodyFieldOption`](interfaces/IObjectBodyFieldOption.md)

#### Defined in

[src/processors/getDefaultOption.ts:65](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getDefaultOption.ts#L65)

___

### getDefaultParamFieldOption

▸ **getDefaultParamFieldOption**(`option?`): [`IParamFieldOption`](interfaces/IParamFieldOption.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `option?` | `Partial`<[`IParamFieldOption`](interfaces/IParamFieldOption.md)\> \| `Omit`<`Partial`<[`IParamFieldOption`](interfaces/IParamFieldOption.md)\>, ``"type"``\> |

#### Returns

[`IParamFieldOption`](interfaces/IParamFieldOption.md)

#### Defined in

[src/processors/getDefaultOption.ts:23](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getDefaultOption.ts#L23)

___

### getDefaultQueryFieldOption

▸ **getDefaultQueryFieldOption**(`option?`): [`IQueryFieldOption`](interfaces/IQueryFieldOption.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `option?` | `Partial`<[`IQueryFieldOption`](interfaces/IQueryFieldOption.md)\> \| `Omit`<`Partial`<[`IQueryFieldOption`](interfaces/IQueryFieldOption.md)\>, ``"type"``\> |

#### Returns

[`IQueryFieldOption`](interfaces/IQueryFieldOption.md)

#### Defined in

[src/processors/getDefaultOption.ts:8](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getDefaultOption.ts#L8)

___

### getHeaderInfo

▸ **getHeaderInfo**<`T`\>(`thisFrame`, `fields`, `strict?`): `Record`<`string`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `thisFrame` | `T` |
| `fields` | `IHeaderField`[] |
| `strict?` | `boolean` |

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[src/processors/getHeaderInfo.ts:51](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getHeaderInfo.ts#L51)

___

### getQueryParamInfo

▸ **getQueryParamInfo**<`T`\>(`origin`, `fields`): `Record`<`string`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `origin` | `T` |
| `fields` | { `key`: `string` ; `option`: [`IParamFieldOption`](interfaces/IParamFieldOption.md) \| [`IQueryFieldOption`](interfaces/IQueryFieldOption.md)  }[] |

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[src/processors/getQueryParamInfo.ts:8](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/getQueryParamInfo.ts#L8)

___

### isValidArrayType

▸ **isValidArrayType**(`value`): value is string[] \| Date[] \| number[] \| boolean[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

value is string[] \| Date[] \| number[] \| boolean[]

#### Defined in

[src/tools/typeAssert.ts:16](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/typeAssert.ts#L16)

___

### isValidPrimitiveType

▸ **isValidPrimitiveType**(`value`): value is string \| number \| boolean \| Date

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

value is string \| number \| boolean \| Date

#### Defined in

[src/tools/typeAssert.ts:3](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/typeAssert.ts#L3)

___

### isValidateStatusDefault

▸ **isValidateStatusDefault**(`status`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `number` |

#### Returns

`boolean`

#### Defined in

[src/tools/isValidateStatusDefault.ts:3](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/isValidateStatusDefault.ts#L3)

___

### processBodyFormatters

▸ **processBodyFormatters**<`T`\>(`strict`, `thisFrame`, `field`, `formatterArgs`): `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `strict` | `boolean` |
| `thisFrame` | `T` |
| `field` | `Object` |
| `field.key` | `string` |
| `field.option` | [`IBodyFieldOption`](interfaces/IBodyFieldOption.md) |
| `formatterArgs` | [`TSingleBodyFormatter`](modules.md#tsinglebodyformatter) \| [`TMultipleBodyFormatter`](modules.md#tmultiplebodyformatter) |

#### Returns

`any`

#### Defined in

[src/processors/processBodyFormatters.ts:8](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/processBodyFormatters.ts#L8)

___

### processObjectBodyFormatters

▸ **processObjectBodyFormatters**<`T`\>(`strict`, `thisFrame`, `field`, `formatterArgs`): `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `strict` | `boolean` |
| `thisFrame` | `T` |
| `field` | `Object` |
| `field.key` | `string` |
| `field.option` | [`IObjectBodyFieldOption`](interfaces/IObjectBodyFieldOption.md) |
| `formatterArgs` | [`TSingleObjectBodyFormatter`](modules.md#tsingleobjectbodyformatter) \| [`TMultipleObjectBodyFormatter`](modules.md#tmultipleobjectbodyformatter) |

#### Returns

`any`

#### Defined in

[src/processors/processObjectBodyFormatters.ts:9](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/processors/processObjectBodyFormatters.ts#L9)

___

### removeBothSlash

▸ **removeBothSlash**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/slashUtils.ts:9](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/slashUtils.ts#L9)

___

### removeEndSlash

▸ **removeEndSlash**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/slashUtils.ts:1](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/slashUtils.ts#L1)

___

### removeStartSlash

▸ **removeStartSlash**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/slashUtils.ts:5](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/slashUtils.ts#L5)

___

### startWithSlash

▸ **startWithSlash**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/slashUtils.ts:13](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/slashUtils.ts#L13)

___

### typeAssert

▸ **typeAssert**(`strict`, `value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `strict` | `boolean` |
| `value` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/tools/typeAssert.ts:33](https://github.com/imjuni/jin-frame/blob/8e8e7e5/src/tools/typeAssert.ts#L33)
