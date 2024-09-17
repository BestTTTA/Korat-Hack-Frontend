"use client"

import { useEffect, useState } from 'react';

export default function TestCache() {
  // ใช้ useState เพื่อเก็บข้อมูลจาก API และสถานะ cache
  const [macData, setMacData] = useState<any>(null);
  const [mpdcData, setMpdcData] = useState<any>(null);
  const [mksData, setMksData] = useState<any>(null);
  const [mpvData, setMpvData] = useState<any>(null);
  const [mplData, setMplData] = useState<any>(null);
  const [mpkData, setMpkData] = useState<any>(null);
  const [sbData, setSbData] = useState<any>(null);

  const [isMacDataCached, setIsMacDataCached] = useState(false);
  const [isMpdcDataCached, setIsMpdcDataCached] = useState(false);
  const [isMksDataCached, setIsMksDataCached] = useState(false);
  const [isMpvDataCached, setIsMpvDataCached] = useState(false);
  const [isMplDataCached, setIsMplDataCached] = useState(false);
  const [isMpkDataCached, setIsMpkDataCached] = useState(false);
  const [isSbDataCached, setIsSbDataCached] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrls = {
        mac: 'https://mitrphol-api.thetigerteamacademy.net/mac_genral/',
        mpdc: 'https://mitrphol-api.thetigerteamacademy.net/mpdc_genral/',
        mks: 'https://mitrphol-api.thetigerteamacademy.net/mks_genral/',
        mpv: 'https://mitrphol-api.thetigerteamacademy.net/mpv_genral/',
        mpl: 'https://mitrphol-api.thetigerteamacademy.net/mpl_genral/',
        mpk: 'https://mitrphol-api.thetigerteamacademy.net/mpk_genral/',
        sb: 'https://mitrphol-api.thetigerteamacademy.net/sb_general/',
      };

      if ('caches' in window) {
        try {
          // เปิด cache ชื่อ 'my-cache'
          const cache = await caches.open('my-cache');

          // ฟังก์ชันสำหรับการดึงข้อมูลจาก API และเก็บใน cache
          const fetchAndCacheData = async (key: string, url: string, setData: any, setCached: any): Promise<void> => {
            const cachedResponse = await cache.match(url);
            if (cachedResponse) {
              // ถ้ามีข้อมูลใน cache ให้ดึงข้อมูลจาก cache
              const cachedData = await cachedResponse.json();
              console.log(`Data from cache for ${key}:`, cachedData);
              setData(cachedData); // เก็บข้อมูลเต็มจำนวน
              setCached(true); // ข้อมูลมีใน cache
            } else {
              // ถ้าไม่มีข้อมูลใน cache ให้ดึงจาก API และเก็บลงใน cache
              const response = await fetch(url);
              const clonedResponse = response.clone(); // clone ก่อนที่จะอ่านข้อมูล
              const apiData = await response.json(); // อ่านข้อมูลจาก response
              console.log(`Data from API for ${key}:`, apiData);
              setData(apiData); // เก็บข้อมูลเต็มจำนวน
              // เก็บข้อมูล response ลงใน cache
              await cache.put(url, clonedResponse);
              setCached(true); // ข้อมูลถูกเก็บลงใน cache แล้ว
            }
          };

          // ดึงข้อมูลจาก API ทั้งหมดและอัพเดต state
          await fetchAndCacheData('mac', apiUrls.mac, setMacData, setIsMacDataCached);
          await fetchAndCacheData('mpdc', apiUrls.mpdc, setMpdcData, setIsMpdcDataCached);
          await fetchAndCacheData('mks', apiUrls.mks, setMksData, setIsMksDataCached);
          await fetchAndCacheData('mpv', apiUrls.mpv, setMpvData, setIsMpvDataCached);
          await fetchAndCacheData('mpl', apiUrls.mpl, setMplData, setIsMplDataCached);
          await fetchAndCacheData('mpk', apiUrls.mpk, setMpkData, setIsMpkDataCached);
          await fetchAndCacheData('sb', apiUrls.sb, setSbData, setIsSbDataCached);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const getLimitedData = (data: any, arrayKey: string) => {
    if (Array.isArray(data)) {
      return data.slice(1000, 1003); // ถ้าเป็น array ให้ slice 2 รายการ
    } else if (data && Array.isArray(data[arrayKey])) {
      return data[arrayKey].slice(1000, 1003); // ถ้ามี array อยู่ข้างใน object ให้ slice 2 รายการ
    } else {
      return data; // แสดงข้อมูลทั้งหมดถ้าไม่ใช่ array
    }
  };

  return (
    <div>
      <h1>Data from Cache (First 2 Entries)</h1>

      <h2>MAC Data:</h2>
      {isMacDataCached ? (
        <pre>{JSON.stringify(getLimitedData(macData, 'mac_entities'), null, 2)}</pre>
      ) : (
        <p>Loading MAC data from cache...</p>
      )}

      <h2>MPDC Data:</h2>
      {isMpdcDataCached ? (
        <pre>{JSON.stringify(getLimitedData(mpdcData, 'mpdc_entities'), null, 2)}</pre>
      ) : (
        <p>Loading MPDC data from cache...</p>
      )}

      <h2>MKS Data:</h2>
      {isMksDataCached ? (
        <pre>{JSON.stringify(getLimitedData(mksData, 'mks_entities'), null, 2)}</pre>
      ) : (
        <p>Loading MKS data from cache...</p>
      )}

      <h2>MPV Data:</h2>
      {isMpvDataCached ? (
        <pre>{JSON.stringify(getLimitedData(mpvData, 'mpv_entities'), null, 2)}</pre>
      ) : (
        <p>Loading MPV data from cache...</p>
      )}

      <h2>MPL Data:</h2>
      {isMplDataCached ? (
        <pre>{JSON.stringify(getLimitedData(mplData, 'mpl_entities'), null, 2)}</pre>
      ) : (
        <p>Loading MPL data from cache...</p>
      )}

      <h2>MPK Data:</h2>
      {isMpkDataCached ? (
        <pre>{JSON.stringify(getLimitedData(mpkData, 'mpk_entities'), null, 2)}</pre>
      ) : (
        <p>Loading MPK data from cache...</p>
      )}

      <h2>SB Data:</h2>
      {isSbDataCached ? (
        <pre>{JSON.stringify(getLimitedData(sbData, 'sb_entities'), null, 2)}</pre>
      ) : (
        <p>Loading SB data from cache...</p>
      )}
    </div>
  );
}
