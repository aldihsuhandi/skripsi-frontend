import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { WishlistQuery, parseNumberUndefined, urlFirstString } from "@/helper";
import { WishlistQueryResult } from "@/types";
import { ItemFilterFormValues } from "@/types/ItemFilter";
import { Field, Form, Formik } from "formik";
import { SessionValidate } from "@/helper/SessionHelper";

export type WishlistFilterBarProps = {
  searchQuery?: string;
  page: string;
  /**
   * Run the setState given from Parent
   */
  setQueryResult: (replace_in_parent: WishlistQueryResult) => void;
};

export const WishlistFilterBar = ({
  searchQuery,
  page,
  setQueryResult,
}: WishlistFilterBarProps) => {
  const router = useRouter();
  // uat trigger form outside form(ik), dipake di useEffect
  // Soalnya klo user refresh ilang, perlu query lagi
  const { pMin, pMax, pSort, hob, itemCat, inLev } = router.query;

  const [ini, setIni] = useState<ItemFilterFormValues>({
    pMin: "",
    pMax: "",
    pSort: "",
    hob: "",
    itemCat: "",
    inLev: "",
  });

  useEffect(() => {
    // get the initialValues for the form from the URL
    const pMin_string = urlFirstString(pMin);
    const pMax_string = urlFirstString(pMax);
    const pSort_string = urlFirstString(pSort);
    const hob_string = urlFirstString(hob);
    const itemCat_string = urlFirstString(itemCat);
    const inLev_string = urlFirstString(inLev);

    setIni({
      pMin: pMin_string || "",
      pMax: pMax_string || "",
      pSort: pSort_string || "",
      hob: hob_string || "",
      itemCat: itemCat_string || "",
      inLev: inLev_string || "",
    });
  }, [pMin, pMax, pSort, hob, itemCat, inLev]);

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
        const isValidSession = await SessionValidate();
        if (isValidSession) {
        } else if (!isValidSession) {
          router.push("/login");
        }

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
        if (values.inLev) {
          Object.assign(flexible_object_for_url, { inLev: values.inLev });
        }

        // 1. Transalte values to appropriate types
        const pMinNumber = parseNumberUndefined(values.pMin);
        const pMaxNumber = parseNumberUndefined(values.pMax);
        // 2. Api call item/query
        const itemQueried = await WishlistQuery({
          itemName: searchQuery || "",
          pMin: pMinNumber,
          pMax: pMaxNumber,
          hob: values.hob,
          itemCat: values.itemCat,
          inLev: values.inLev,
        });

        // 3. setState variable parent pake setQueryResult():
        if (itemQueried.resultContext.success) {
          setQueryResult(itemQueried);
          router.push({
            pathname: `/${page}`,
            query: flexible_object_for_url,
          });
        } else if (itemQueried.resultContext.resultCode === "SESSION_EXPIRED") {
          router.push("/login");
        } else {
          alert("System is Busy!");
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-2">
            <div className="col-span-4">
              <div className="grid grid-cols-3 gap-2 px-3 pb-2">
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

                {/* MASIH HARDCODED
                    !!! Ntar di useEffect API Call uat ambil list of Hobbies, trus baru populate optionsnya
                */}

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
                    <option value="Keyboard">Keyboard</option>
                    <option value="GPU">GPU</option>
                    <option value="music">Music</option>
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="itemCat"
                    className="mb-1 block text-sm font-medium"
                  >
                    Category
                  </label>

                  {/* 
                    !!! MASIH HARDCODED !!!
                    TODO: itemCat di disable klo Hobby/hob blom di pilih
                    abis dipilih di onChange panggil apiCall minta list category dari tu hobby apa aja
                    trus baru di-enable trus isi optionnya
                */}

                  <Field
                    as="select"
                    name="itemCat"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("itemCat", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    <option value="Guitar">Guitar</option>
                    <option value="AMD">AMD</option>
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="inLev"
                    className="mb-1 block text-sm font-medium"
                  >
                    Interest Level
                  </label>
                  <Field
                    as="select"
                    name="inLev"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("inLev", event.target.value);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Enthusiast">Enthusiast</option>
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
