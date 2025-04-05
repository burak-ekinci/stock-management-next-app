"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  const [isMobile, setIsMobile] = useState(false);

  // Ekran boyutunu izle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // İlk yükleme durumunu ayarla
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Admin ve normal kullanıcılar için farklı menü öğeleri
  const navigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Ürünler", href: "/products" },
  ];

  const userNavigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Ürünler", href: "/products" },
    { name: "Hakkımızda", href: "/#about" },
    { name: "İletişim", href: "/#contact" },
  ];

  const adminNavigation = [
    { name: "Yönetim Paneli", href: "/admin" },
    { name: "Markalar", href: "/admin/brands" },
    { name: "Modeller", href: "/admin/models" },
    { name: "Ürünler", href: "/admin/products" },
    { name: "Kullanıcılar", href: "/admin/users" },
  ];

  const adminActions = [
    { name: "Marka Ekle", href: "/admin/brands/new" },
    { name: "Model Ekle", href: "/admin/models/new" },
    { name: "Ürün Ekle", href: "/admin/products/new" },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Disclosure as="nav" className="bg-[#4c566a] shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobil menü butonu */}
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-[#3b4252] hover:text-[#f1953e] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f1953e]">
                  <span className="sr-only">Ana menüyü aç</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo ve ana navigasyon */}
              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                {/* Logo */}
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="text-white font-bold text-xl">
                    Ekinci Elektronik
                  </Link>
                </div>

                {/* Masaüstü Ana Menü */}
                <div className="hidden md:ml-6 md:flex md:space-x-2 lg:space-x-4">
                  {isAdmin
                    ? navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-white hover:bg-[#3b4252] hover:text-[#f1953e] rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      ))
                    : userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-white hover:bg-[#3b4252] hover:text-[#f1953e] rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      ))}

                  {/* Admin Dropdown - Masaüstü */}
                  {isAdmin && (
                    <Menu as="div" className="relative ml-2">
                      <Menu.Button className="inline-flex items-center rounded-md bg-[#3b4252] px-3 py-2 text-sm font-medium text-white hover:bg-[#4c566a] focus:outline-none focus:ring-2 focus:ring-[#f1953e]">
                        Admin
                        <ChevronDownIcon
                          className="ml-1 -mr-1 h-4 w-4"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {/* Admin Ana Sayfaları */}
                          <div className="px-1 py-1 border-b border-gray-200">
                            {adminNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    href={item.href}
                                    className={`${
                                      active
                                        ? "bg-[#eceff4] text-[#f1953e]"
                                        : "text-gray-700"
                                    } block px-4 py-2 text-sm rounded-md`}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </div>

                          {/* Admin Hızlı Erişim */}
                          <div className="px-1 py-1">
                            {adminActions.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    href={item.href}
                                    className={`${
                                      active
                                        ? "bg-[#eceff4] text-[#f1953e]"
                                        : "text-gray-700"
                                    } block px-4 py-2 text-sm rounded-md`}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
              </div>

              {/* Kullanıcı menüsü */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {session ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#f1953e]">
                        <span className="sr-only">Kullanıcı menüsünü aç</span>
                        <div className="flex items-center gap-2 text-white px-2 py-1 rounded-full hover:bg-[#3b4252]">
                          <span className="hidden sm:inline-block">
                            {session.user.name}
                          </span>
                          {isAdmin && (
                            <span className="hidden sm:inline-flex ml-1 text-xs bg-[#f1953e] text-[#2e3440] px-1 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                          <div className="h-8 w-8 rounded-full bg-[#f1953e] flex items-center justify-center text-[#2e3440] font-semibold">
                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <div className="px-4 py-2 text-sm border-b border-gray-200">
                              <p className="font-medium text-[#2e3440]">
                                {session.user.name}
                              </p>
                              <p className="text-gray-500 text-xs mt-1 truncate">
                                {session.user.email}
                              </p>
                              <p className="text-xs mt-2 text-[#f1953e] font-medium">
                                {session.user.role === "admin"
                                  ? "Admin Kullanıcı"
                                  : "Standart Kullanıcı"}
                              </p>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={`${
                                active
                                  ? "bg-[#eceff4] text-[#f1953e]"
                                  : "text-gray-700"
                              } block px-4 py-2 text-sm`}
                            >
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5 mr-2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                                Profilim ve Ayarlar
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                        {isAdmin && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/admin"
                                className={`${
                                  active
                                    ? "bg-[#eceff4] text-[#f1953e]"
                                    : "text-gray-700"
                                } block px-4 py-2 text-sm`}
                              >
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                  </svg>
                                  Yönetim Paneli
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`${
                                active
                                  ? "bg-[#eceff4] text-[#bf616a]"
                                  : "text-[#bf616a]"
                              } block w-full text-left px-4 py-2 text-sm`}
                            >
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5 mr-2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                  />
                                </svg>
                                Çıkış Yap
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center gap-2">
                    {isMobile ? (
                      <Link
                        href="/auth/login"
                        className="rounded-md bg-[#f1953e] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f1953e] transition-colors"
                      >
                        Giriş
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="rounded-md bg-[#f1953e] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f1953e] transition-colors"
                        >
                          Giriş Yap
                        </Link>
                        <Link
                          href="/auth/register"
                          className="rounded-md bg-[#a3be8c] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#8fbcbb] transition-colors"
                        >
                          Kayıt Ol
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobil menü */}
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {isAdmin
                ? navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:bg-[#3b4252] hover:text-[#f1953e] block rounded-md px-3 py-2 text-base font-medium"
                    >
                      {item.name}
                    </Link>
                  ))
                : userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:bg-[#3b4252] hover:text-[#f1953e] block rounded-md px-3 py-2 text-base font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}

              {/* Admin Menüsü - Mobil */}
              {isAdmin && (
                <>
                  <div className="border-t border-[#3b4252] my-2 pt-2">
                    <p className="px-3 text-sm font-bold text-[#f1953e]">
                      Admin Menüsü
                    </p>
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-white hover:bg-[#3b4252] hover:text-[#f1953e] block rounded-md px-3 py-2 text-base font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[#3b4252] my-2 pt-2">
                    <p className="px-3 text-sm font-bold text-[#f1953e]">
                      Hızlı İşlemler
                    </p>
                    {adminActions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-white hover:bg-[#3b4252] hover:text-[#f1953e] block rounded-md px-3 py-2 text-base font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Oturum Açmamış Kullanıcılar için Mobil */}
              {!session && (
                <div className="border-t border-[#3b4252] my-2 pt-2 flex gap-2 px-2">
                  <Link
                    href="/auth/login"
                    className="flex-1 rounded-md bg-[#f1953e] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f1953e] transition-colors text-center"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex-1 rounded-md bg-[#a3be8c] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#8fbcbb] transition-colors text-center"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
