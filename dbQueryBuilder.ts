type ObjectType<T> = { new (): T } | Function

type Maybe<T> = T | undefined | null;

type UnArray<U> = U extends (infer V)[] ? UnArray<V> : U;

type TInfos<U extends Record<string, any>> = {
  arguments?: QueryArguments<U>;
  fields: {
    [K in keyof U]: Exclude<UnArray<U[K]>, null | undefined> extends
      | string
      | number
      | Date
      | boolean
      ? K
      : never;
  }[keyof U][];
  relations?: {
    [key in {
      [K in keyof U]: Exclude<UnArray<U[K]>, null | undefined> extends Record<string, any>
        ? K
        : never;
    }[keyof U]]?: TInfos<Exclude<UnArray<U[key]>, null | undefined>>;
  };
};

type GetMandatoryKeys<T> = {
  [P in keyof T]: T[P] extends Exclude<T[P], undefined> ? P : never;
}[keyof T];

type MandatoryProps<T> = Pick<T, GetMandatoryKeys<T>>;

type TPicks<U extends Record<string, any>, V extends TInfos<U>> = Partial<
  TPicksWithUndefined<U, V>
> &
  MandatoryProps<TPicksWithUndefined<U, V>>;

type TPicksWithUndefined<U extends Record<string, any>, V extends TInfos<U>> = {
  [key in V['fields'][number]]: key extends keyof U ? U[key] : never;
} & {
  [key in keyof V['relations']]: key extends keyof U
    ? Exclude<U[key], null | undefined> extends any[]
      ? // @ts-expect-error Tbh dont know, but it works
        TPicks<Exclude<UnArray<U[key]>, null | undefined>, V['relations'][key]>[]
      : // @ts-expect-error tbh dont know, but it works
        TPicks<Exclude<UnArray<U[key]>, null | undefined>, V['relations'][key]>
    : never;
};


type modifyKey<T extends string> =
  | T
  | `${T}_gt`
  | `${T}_gte`
  | `${T}_in`
  | `${T}_like`
  | `${T}_lt`
  | `${T}_lte`
  | `${T}_match`
  | `${T}_not`
  | `${T}_not_in`
  | `${T}_not_like`
  | `${T}_not_match`
  | `${T}_every`
  | `${T}_none`
  | `${T}_some`
  | `${T}_date`
  | `${T}_date_gt`
  | `${T}_date_lt`
  | `${T}_date_gte`
  | `${T}_date_lte`;

type ArgumentFieldBasic<T extends Record<string, any>> = {
  [key in keyof T as key extends string ? modifyKey<key> : key]?:
    | UnArray<T[key]>
    | ArgumentField<UnArray<T[key]>>
    | ArgumentField<UnArray<T[key]>>[]
    | null;
};

type ArgumentAndOrField<T extends Record<string, any>> = {
  OR?: ArgumentField<UnArray<T>>[] | null;
  AND?: ArgumentField<UnArray<T>>[] | null;
};

type ArgumentField<T extends Record<string, any>> = ArgumentAndOrField<T> &
  ArgumentFieldBasic<T>;

type OrderByInput<T extends Record<string, any>> =
  | `${keyof T extends string ? keyof T : 'None'}_DESC`
  | `${keyof T extends string ? keyof T : 'None'}_ASC`;

type OrderByArrayInput<T extends Record<string, any>> = {
  nulls?: 'NULLS_FIRST' | 'NULLS_LAST' | null;
  sort: OrderByInput<T>;
  useNumericValue?: boolean | null;
};
type QueryArguments<T extends Record<string, any>> = {
    where?: ArgumentField<T> | null;
    orderBy?: OrderByInput<T> | null;
    orderByArray?: OrderByArrayInput<T>[] | null;
    first?: string | number | null;
    last?: string | number | null;
    skip?: string | number | null;
    withDeleted?: boolean | null;
  };
  

  
// ---------------------------------EXAMPLE DATA-----------------------------------------------------------------
//
  
// async function getOne<Entity extends Record<string, any>, T extends TInfos<Entity>>(
//     objectType: ObjectType<Entity>,
//     args: QueryArguments<Entity>,
//     info: T,
//   ): Promise<TPicks<Entity, T> | null> {
//     return null;
//   }
  

//   class Account {
//     id: number;
//     hostname: string;
// }


// const checkHostnameAlreadyExist = await getOne(
//     Account,
//     { where: { hostname: 'myName', id_not: 42 } },
//     {
//       fields: ['id'],
//     },
//   );
