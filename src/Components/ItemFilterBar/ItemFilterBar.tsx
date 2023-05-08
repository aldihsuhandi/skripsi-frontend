import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import {
  ItemFilterQuery,
  parseNumberUndefined,
  urlFirstString,
} from "@/helper";
import { ItemQueryResult } from "@/types";
import { ItemFilterFormValues } from "@/types/ItemFilter";
import { Field, Form, Formik } from "formik";
import { FilterDictionary } from "@/helper/FilterDictionary/FIlterDictionaryCall";

export type ItemFilterBarProps = {
  searchQuery?: string;
  page: string;
  /**
   * Run the setState given from Parent
   */
  setQueryResult: (replace_in_parent: ItemQueryResult) => void;
};

export const ItemFilterBar = ({
  searchQuery,
  page,
  setQueryResult,
}: ItemFilterBarProps) => {
  const router = useRouter();
  // uat trigger form outside form(ik), dipake di useEffect
  // Soalnya klo user refresh ilang, perlu query lagi
  const { q, pMin, pMax, pSort, hob, itemCat, inLevMerchant, inLevUser } =
    router.query;

  const [hobbyList, setHobbyList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [interestList, setInterestList] = useState<string[]>([]);

  const [ini, setIni] = useState<ItemFilterFormValues>({
    pMin: "",
    pMax: "",
    pSort: "",
    hob: "",
    itemCat: "",
    inLevMerchant: "",
    inLevUser: "",
  });

  useEffect(() => {
    // get the initialValues for the form from the URL
    const pMin_string = urlFirstString(pMin);
    const pMax_string = urlFirstString(pMax);
    const pSort_string = urlFirstString(pSort);
    const hob_string = urlFirstString(hob);
    const itemCat_string = urlFirstString(itemCat);
    const inLevMerchant_string = urlFirstString(inLevMerchant);
    const inLevUser_string = urlFirstString(inLevUser);

    setIni({
      pMin: pMin_string || "",
      pMax: pMax_string || "",
      pSort: pSort_string || "",
      hob: hob_string || "",
      itemCat: itemCat_string || "",
      inLevMerchant: inLevMerchant_string || "",
      inLevUser: inLevUser_string || "",
    });

    const getDictionaries = async () => {
      // Masih Temp errornya, di different Task
      const hobList = await FilterDictionary({ dictionaryKey: "HOBBY" }).catch(
        () => alert("Error!")
      );
      const catList = await FilterDictionary({
        dictionaryKey: "CATEGORY",
      }).catch(() => alert("Error!"));
      const inList = await FilterDictionary({
        dictionaryKey: "INTEREST_LEVEL",
      }).catch(() => alert("Error!"));

      hobList && setHobbyList(hobList.dictionaries);
      catList && setCategoryList(catList.dictionaries);
      inList && setInterestList(inList.dictionaries);
    };
    getDictionaries();
  }, [pMin, pMax, pSort, hob, itemCat, inLevMerchant, inLevUser]);

  function handleKeyDownPreventWords(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    // Allow: backspace, delete, tab, escape, enter, and decimal point
    // TODO: Test lagi yang bener2 perlu di allow dan di ban apa di field number/max-min-price
    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "Escape" ||
      event.key === "Enter" ||
      event.key === "."
    ) {
      // Allow input
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
    }

    // Ensure that it is a number and stop the keypress
    if (isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  return (
    <Formik
      initialValues={ini}
      enableReinitialize
      onSubmit={async (values) => {
        console.log(values);

        let flexible_object_for_url = {};
        if (searchQuery) {
          Object.assign(flexible_object_for_url, { q: searchQuery });
        }
        if (values.pMin) {
          Object.assign(flexible_object_for_url, { pMin: values.pMin });
        }
        if (values.pMax) {
          Object.assign(flexible_object_for_url, { pMax: values.pMax });
        }
        if (values.pSort) {
          Object.assign(flexible_object_for_url, { pSort: values.pSort });
        }
        if (values.hob) {
          Object.assign(flexible_object_for_url, { hob: values.hob });
        }
        if (values.itemCat) {
          Object.assign(flexible_object_for_url, { itemCat: values.itemCat });
        }
        if (values.inLevMerchant) {
          Object.assign(flexible_object_for_url, {
            inLevMerchant: values.inLevMerchant,
          });
        }
        if (values.inLevUser) {
          Object.assign(flexible_object_for_url, {
            inLevUser: values.inLevUser,
          });
        }

        console.log(flexible_object_for_url, "yang diapke di router.push ntar");
        console.log(page + " " + searchQuery, "page + searchQuery");

        // 1. Transalte values to appropriate types
        const pMinNumber = parseNumberUndefined(values.pMin);
        const pMaxNumber = parseNumberUndefined(values.pMax);
        // 2. Api call item/query
        const itemQueried = await ItemFilterQuery({
          itemName: searchQuery || "",
          pMin: pMinNumber,
          pMax: pMaxNumber,
          hob: values.hob,
          itemCat: values.itemCat,
          inLevMerchant: values.inLevMerchant,
          inLevUser: values.inLevUser,
        });

        // 3. setState variable parent pake setQueryResult():
        setQueryResult(itemQueried);

        router.push({
          pathname: `/${page}`,
          query: flexible_object_for_url,
        });
      }}
    >
      {({ setFieldValue }) => (
        <Form className="min-w-[20%] lg:basis-1/5">
          <div className="grid grid-cols-1 lg:flex lg:flex-col">
            <div>
              <div className="grid grid-cols-2 gap-2 px-3 pb-2 lg:flex lg:flex-col">
                <div>
                  <label
                    htmlFor="pMin"
                    className="mb-1 block text-sm font-medium"
                  >
                    Min Price
                  </label>
                  <Field
                    type="number"
                    name="pMin"
                    onKeyDown={handleKeyDownPreventWords}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pMax"
                    className="mb-1 block text-sm font-medium"
                  >
                    Max Price
                  </label>
                  <Field
                    type="number"
                    name="pMax"
                    onKeyDown={handleKeyDownPreventWords}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pSort"
                    className="mb-1 block text-sm font-medium"
                  >
                    Price Sort
                  </label>
                  <Field
                    as="select"
                    name="pSort"
                    defaultValue={undefined}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("pSort", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Price Sorting</option>
                    <option value="desc">Decending</option>
                    <option value="asc">Ascending</option>
                  </Field>
                </div>

                <div>
                  <label
                    htmlFor="hob"
                    className="mb-1 block text-sm font-medium"
                  >
                    Hobby
                  </label>
                  <Field
                    as="select"
                    name="hob"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("hob", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    {hobbyList.map((value) => (
                      <option value={value}>{value}</option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="itemCat"
                    className="mb-1 block text-sm font-medium"
                  >
                    Category
                  </label>

                  <Field
                    as="select"
                    name="itemCat"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("itemCat", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    {categoryList.map((value) => (
                      <option value={value}>{value}</option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="inLev"
                    className="mb-1 block text-sm font-medium"
                  >
                    Merchant Interest Level
                  </label>
                  <Field
                    as="select"
                    name="inLevMerchant"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("inLevMerchant", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    {interestList.map((value) => (
                      <option value={value}>{value}</option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="inLev"
                    className="mb-1 block text-sm font-medium"
                  >
                    Community Interest Level
                  </label>
                  <Field
                    as="select"
                    name="inLevUser"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("inLevUser", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    {interestList.map((value) => (
                      <option value={value}>{value}</option>
                    ))}
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex px-2">
              <div className="w-full rounded border border-normal-blue bg-normal-blue px-2 py-2">
                <button className="bold bold w-full text-white" type="submit">
                  Apply filter
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
