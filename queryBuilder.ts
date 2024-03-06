type TQueryBuilderOptions<VariablesType = undefined, FieldsType = undefined> = {
    operation: string;
  } & (VariablesType extends undefined | null ? {
    variables?: TQueryBuilderVariables<VariablesType>;
  } : {
    variables: TQueryBuilderVariables<VariablesType>;
  }) & (FieldsType extends undefined | null ? {
    fields?: TQueryBuilderFields<FieldsType>;
  } : {
    fields: TQueryBuilderFields<FieldsType>;
  })
  
  type TQueryBuilderVariables<T> = (
    T extends Record<string, any> ? {
      [K in keyof T]: TQueryBuilderVariableOption<T[K]>;
    } : TQueryBuilderVariableOption<T>
  )
  
  type TQueryBuilderVariableOption<K> = {
    type?: string;
    name?: string;
    value: K;
  } & (
    K extends any[] ? {
      list: true;
    } : {
      list?: boolean;
    }
  ) & (
    K extends undefined ? {
      required?: false;
    } : {
      required: true;
    }
  )
  
  type TQueryBuilderFields<U> = (
    (U extends (infer V)[] ? TQueryBuilderFields<V> : TQueryBuilderField<U, U[keyof U]>[])
  )
  
  type TQueryBuilderField<F, V> = (
    F extends (infer U)[] ?
      TQueryBuilderField<U, U[keyof U]>
      : (V extends Record<string, any> ? {
        [key in keyof F]?: F[key] extends Record<string, any> ? TQueryBuilderField<V, V[keyof V]>[] : never;
      }
        : keyof F
      )
  )
  
  interface IGraphQLQuery {
    variables: unknown;
    query: string;
  }
  
  // ---------------------------------EXAMPLE DATA-----------------------------------------------------------------
  //
  
  // const vec: TQueryBuilderOptions<
  // { id: number[] },
  // { id: number; udada: string; karel: { www: boolean; ww: boolean }[][][] }[][][][]
  // > = {
  //   operation: 'oops',
  //   variables: {
  //     id: {
  //       list: true,
  //       required: true,
  //       value: [77],
  //     },
  //   },
  //   fields: [
  //     'id',
  //     'udada',
  //     {
  //       karel: ['www', 'ww'],
  //     },
  //   ],
  // };
  
  // const veeeec: TQueryBuilderOptions = {
  //   operation: 'somoo',
  // };
  
  // const vwattt: TQueryBuilderOptions<undefined, { id: number; babicka: { ss: number; qq: string }[] }> = {
  //   operation: 'blbost',
  //   fields: [
  //     'id',
  //     {
  //       babicka: ['qq', 'ss'],
  //     },
  //   ],
  // };
  